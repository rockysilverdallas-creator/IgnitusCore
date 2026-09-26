// Vercel Serverless Function: Tiana AI // Structured 2-Step Multi-Trade Inbound Intake
// Route: /api/twilio/voice
// Architecture: Greeting & Full Intake -> Cognitive Gemini 3.6 Confirmation -> Clean Hangup (No Loops)

import fs from "fs";
import path from "path";

// Auto-detect .env
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

const TIANA_TRIAGE_CONFIRMATION_PROMPT = `You are TIANA AI: The 24/7 Front-Line Inbound Concierge for Ignitus Core, founded by Sylvester George Bhatti.
The caller just called in and stated their repair or service request.
Your Persona:
- Authoritative, reassuring, high-end commercial dispatcher.
- Spoken voice style: EXACTLY 1 to 2 concise sentences. Natural spoken human cadence.
- NEVER use markdown, bullet points, asterisks, or robotic phrasing.
Objectives:
1. Specifically acknowledge their trade and emergency (e.g. AC failure, pipe leak, roof damage, electrical breaker, or commercial project).
2. Acknowledge their location or address if mentioned.
3. Inform them that their emergency dispatch ticket is locked and Sylvester's on-call field crew has their phone number and is dispatching follow-up immediately.
4. Close warmly. DO NOT ask any more questions. DO NOT ask for a time window.`;

export default async function handler(req, res) {
  res.setHeader("Content-Type", "text/xml");

  const callerNumber = req.body?.From || req.query?.From || "Unknown Caller";
  const callSid = req.body?.CallSid || req.query?.CallSid || `call_${Date.now()}`;
  const speechInput = req.body?.SpeechResult || req.query?.SpeechResult || "";
  const apiKey = getGeminiApiKey();

  // TURN 1: INITIAL GREETING + INTAKE (Caller connected, listening for full problem)
  if (!speechInput) {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Danielle-Neural">
        Thank you for calling Ignitus Core. I am Tiana, your twenty-four seven trade concierge. 
        Please state your name, your trade emergency—whether it is HVAC, plumbing, electrical, or roofing—and your service address.
    </Say>
    <Gather input="speech" action="/api/twilio/voice" method="POST" timeout="6" speechTimeout="auto">
        <Pause length="1"/>
    </Gather>
    <Say voice="Polly.Danielle-Neural">
        I did not catch that. Please state the trade emergency and your location after the tone.
    </Say>
    <Gather input="speech" action="/api/twilio/voice" method="POST" timeout="6" speechTimeout="auto"/>
    <Say voice="Polly.Danielle-Neural">
        We have recorded your line. Sylvester's dispatch crew will follow up with you directly on this number.
    </Say>
    <Hangup/>
</Response>`;
    res.setHeader("Content-Type", "text/xml");
  if (typeof res.status === "function") {
    return res.status(200).send(twiml);
  } else {
    res.writeHead(200, { "Content-Type": "text/xml" });
    return res.end(twiml);
  }
  }

  // TURN 2: COGNITIVE CONFIRMATION & CLEAN EXIT (Caller spoke -> Parse & Confirm -> Hang up cleanly)
  let agentSpokenResponse = "";

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
                    text: `${TIANA_TRIAGE_CONFIRMATION_PROMPT}\n\nCALLER PHONE: ${callerNumber}\nCALLER SAID: "${speechInput}"\nYOUR 1-2 SENTENCE SPOKEN CONFIRMATION:`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 1024,
            }
          })
        }
      );

      if (aiResponse.ok) {
        const data = await aiResponse.json();
        const parts = data.candidates?.[0]?.content?.parts || [];
        agentSpokenResponse = parts.map(p => p.text || "").join("").trim();
        agentSpokenResponse = agentSpokenResponse.replace(/[*_#`]/g, "").trim();
      }
    } catch (_) {}
  }

  // Robust fallback if AI call times out
  if (!agentSpokenResponse) {
    const lower = speechInput.toLowerCase();
    let trade = "service";
    if (lower.includes("plumb") || lower.includes("pipe") || lower.includes("water") || lower.includes("leak") || lower.includes("drain")) {
      trade = "emergency plumbing";
    } else if (lower.includes("ac") || lower.includes("hvac") || lower.includes("heat") || lower.includes("air") || lower.includes("cooling")) {
      trade = "urgent HVAC";
    } else if (lower.includes("roof") || lower.includes("shingle") || lower.includes("storm")) {
      trade = "roofing repair";
    } else if (lower.includes("electric") || lower.includes("breaker") || lower.includes("power") || lower.includes("wire")) {
      trade = "electrical dispatch";
    }
    agentSpokenResponse = `Thank you. I have logged your ${trade} request into our priority schedule. Sylvester and our on-call field crew have your contact number and are reviewing your dispatch ticket right now.`;
  }

  // ASYNC TELEMETRY TO SHAER CLOUD RUN & FIREBASE
  try {
    fetch(CLOUD_RUN_SHAER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "tiana_voice_reasoning_agent",
        action: "trade_intake_confirmed",
        call_sid: callSid,
        caller: callerNumber,
        caller_speech: speechInput,
        tiana_confirmation: agentSpokenResponse,
        mesh_bus: `${FIREBASE_PROJECT_ID}/swarm_intelligence/live_voice_calls`,
        timestamp: new Date().toISOString()
      })
    }).catch(() => {});
  } catch (_) {}

  // FINAL CLEAN TWIML: Speaks the confirmation and HANGS UP CLEANLY (NO LOOPS)
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Danielle-Neural">${agentSpokenResponse}</Say>
    <Pause length="1"/>
    <Say voice="Polly.Danielle-Neural">Thank you for choosing Ignitus Core. Have a great day.</Say>
    <Hangup/>
</Response>`;

  res.setHeader("Content-Type", "text/xml");
  if (typeof res.status === "function") {
    return res.status(200).send(twiml);
  } else {
    res.writeHead(200, { "Content-Type": "text/xml" });
    return res.end(twiml);
  }
}
