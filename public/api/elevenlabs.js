// Vercel Serverless Function: ElevenLabs Voice Synthesis API Integration
// Route: /api/elevenlabs
// Integrates ElevenLabs Text-to-Speech (TTS), Voice Cloning, and Real-Time Audio Generation into Ignitus Core

import fs from "fs";
import path from "path";

// Auto-detect .env locally
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

function getElevenLabsKey() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY.trim();
  if (process.env.XI_API_KEY) return process.env.XI_API_KEY.trim();
  if (process.env.ELEVEN_LABS_KEY) return process.env.ELEVEN_LABS_KEY.trim();

  for (const [key, val] of Object.entries(process.env)) {
    const clean = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (["elevenlabsapikey", "xiapikey", "elevenlabskey"].includes(clean)) {
      if (val && val.trim()) return val.trim();
    }
  }
  return "";
}

// Popular ElevenLabs Default Voice IDs
const DEFAULT_VOICES = {
  "adam": "pNInz6obpgDQGcFmaJgB",
  "rachel": "21m00Tcm4TlvDq8ikWAM",
  "domi": "AZnzlk1XvdvUeBnXmlld",
  "bella": "EXAVITQu4vr4xnSDxMaL",
  "antoni": "ErXwobaYiN019PkySvjV",
  "josh": "TxGEqnHWrfWFTfGW9XjX",
  "arnold": "VR6AewLTigWG4xSOukaG"
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, xi-api-key"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const apiKey = getElevenLabsKey();

  // GET: Health Check & Capabilities Discovery
  if (req.method === "GET") {
    return res.status(200).json({
      service: "ELEVENLABS_VOICE_SYNTHESIS",
      status: apiKey ? "ARMED_AND_READY" : "MISSING_API_KEY",
      api_key_configured: Boolean(apiKey),
      preset_voices: DEFAULT_VOICES,
      supported_models: [
        "eleven_multilingual_v2",
        "eleven_turbo_v2",
        "eleven_monolingual_v1"
      ],
      documentation: "Pass POST request with { text, voice_id, model_id } to generate synthesized voice audio."
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!apiKey) {
    return res.status(400).json({
      error: "MISSING_ELEVENLABS_API_KEY",
      message: "Please add ELEVENLABS_API_KEY to your environment variables or .env file."
    });
  }

  try {
    const {
      text = "Ignitus Core voice synthesis system active.",
      voice_id = DEFAULT_VOICES.adam,
      model_id = "eleven_turbo_v2",
      stability = 0.5,
      similarity_boost = 0.75,
      return_base64 = false
    } = req.body || {};

    const targetVoiceId = DEFAULT_VOICES[voice_id.toLowerCase()] || voice_id;

    const elevenResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}`, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey
      },
      body: JSON.stringify({
        text,
        model_id,
        voice_settings: {
          stability,
          similarity_boost
        }
      })
    });

    if (!elevenResponse.ok) {
      const errorText = await elevenResponse.text();
      return res.status(elevenResponse.status).json({
        error: "ELEVENLABS_API_ERROR",
        details: errorText
      });
    }

    const audioBuffer = await elevenResponse.arrayBuffer();
    const buffer = Buffer.from(audioBuffer);

    if (return_base64) {
      return res.status(200).json({
        status: "SUCCESS",
        format: "audio/mpeg",
        voice_id: targetVoiceId,
        audio_base64: buffer.toString("base64")
      });
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", buffer.length);
    return res.status(200).send(buffer);

  } catch (error) {
    return res.status(500).json({
      error: "ElevenLabs Execution Error",
      details: error.message
    });
  }
}
