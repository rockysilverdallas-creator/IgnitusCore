// Vercel Serverless Function: Tiana AI // Human Conversational Inbound Concierge
// Route: /api/twilio/voice
// Architecture: Ultra-Natural Human Greeting -> Cognitive Gemini 2.5/3.6 Reasoning -> Conversational Two-Way Exchange

import fs from "fs";
import path from "path";

try {
  if (typeof process.loadEnvFile === "function") {
    process.loadEnvFile();
  } else {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, "utf8").split("\n");
      for (const line of lines) {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const k = match[1];
          const v = (match[2] || "").trim().replace(/^['"]|['"]$/g, "");
          if (!process.env[k]) process.env[k] = v;
        }
      }
    }
  }
} catch (_) {}

const CLOUD_RUN_SHAER_URL = process.env.CLOUD_RUN_SHAER_URL || "https://ignitus-shaer-fauxnyn7sa-uc.a.run.app/api/action/dispatch";
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "ignitus-d1e7b";

function getGeminiApiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY.trim();
  if (process.env.GOOGLE_API_KEY) return process.env.GOOGLE_API_KEY.trim();
  if (process.env.SOVEREIGN_LLM_KEY) return process.env.SOVEREIGN_LLM_KEY.trim();
  for (const [k, v] of Object.entries(process.env)) {
    const clean = k.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (["geminiapikey", "geminikey", "googleapikey"].includes(clean)) {
      if (v && v.trim()) return v.trim();
    }
  }
  return "";
}

const TIANA_HUMAN_CONVERSATIONAL_PROMPT = `You are Tiana, the warm, sharp, and highly attentive human concierge at Ignitus Core (working alongside Sly Bhatti in Shreveport).
A customer just called our line and said: "{SPEECH}"

Your Goal:
- Respond like a real, friendly, confident human teammate answering a live call.
- NEVER sound like a voicemail, automated machine, or IVR bot.
- Acknowledge their issue directly in 1 to 2 warm, natural sentences.
- Reassure them that Sly and the on-call field team have received their message and are reaching out immediately.
- NO bullet points, NO robotic intros ("Thank you for calling..."), NO formal script. Speak like a real person on a phone.`;

export default async function handler(req, res) {
  res.setHeader("Content-Type", "text/xml");

  const callerNumber = req.body?.From || req.query?.From || "Unknown Caller";
  const callSid = req.body?.CallSid || req.query?.CallSid || `call_${Date.now()}`;
  const speechInput = req.body?.SpeechResult || req.query?.SpeechResult || "";
  const apiKey = getGeminiApiKey();

  // TURN 1: NATURAL HUMAN GREETING (No robotic IVR prompts)
  if (!speechInput) {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Danielle-Neural">
        Hey there, thanks for calling Ignitus Core! This is Tiana—I'm on the dispatch desk. Go ahead and tell me what you're working on or what you need help with today, and I'll get you taken care of.
    </Say>
    <Gather input="speech" action="/api/twilio/voice" method="POST" timeout="7" speechTimeout="auto">
        <Pause length="1"/>
    </Gather>
    <Say voice="Polly.Danielle-Neural">
        Hey, I didn't quite hear you there. Go ahead and tell me what you need, and where you're located.
    </Say>
    <Gather input="speech" action="/api/twilio/voice" method="POST" timeout="7" speechTimeout="auto"/>
    <Say voice="Polly.Danielle-Neural">
        No problem at all—I've got your number logged. Sly or one of our team members will text or call you right back on this line. Have a great day!
    </Say>
    <Hangup/>
</Response>`;

    if (typeof res.status === "function") {
      return res.status(200).send(twiml);
    } else {
      res.writeHead(200, { "Content-Type": "text/xml" });
      return res.end(twiml);
    }
  }

  // TURN 2: COGNITIVE HUMAN REASONING RESPONSE
  let humanResponseText = "";

  if (apiKey) {
    try {
      const aiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: TIANA_HUMAN_CONVERSATIONAL_PROMPT.replace("{SPEECH}", speechInput)
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 256,
            }
          })
        }
      );

      if (aiResponse.ok) {
        const data = await aiResponse.json();
        const parts = data.candidates?.[0]?.content?.parts || [];
        humanResponseText = parts.map(p => p.text || "").join("").trim();
        humanResponseText = humanResponseText.replace(/[*_#`]/g, "").trim();
      }
    } catch (_) {}
  }

  if (!humanResponseText) {
    humanResponseText = `Awesome, I've got all those details written down. I'm flagging this for Sly and our field crew right now—someone will give you a quick ring or text back on this number shortly!`;
  }

  // Telemetry to Cloud Run
  try {
    fetch(CLOUD_RUN_SHAER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "tiana_human_conversational_agent",
        action: "live_call_triaged",
        call_sid: callSid,
        caller: callerNumber,
        caller_said: speechInput,
        tiana_replied: humanResponseText,
        timestamp: new Date().toISOString()
      })
    }).catch(() => {});
  } catch (_) {}

  // HUMAN RESPONSE TWIML
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Danielle-Neural">${humanResponseText}</Say>
    <Pause length="1"/>
    <Say voice="Polly.Danielle-Neural">Take care and talk to you soon!</Say>
    <Hangup/>
</Response>`;

  if (typeof res.status === "function") {
    return res.status(200).send(twiml);
  } else {
    res.writeHead(200, { "Content-Type": "text/xml" });
    return res.end(twiml);
  }
}
