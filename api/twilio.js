// Consolidated Twilio webhook dispatcher — 5 endpoints, 1 function.
import voiceHandler from "../lib/twilio/voice.js";
import smsHandler from "../lib/twilio/sms.js";
import statusHandler from "../lib/twilio/status.js";
import screenHandler from "../lib/twilio/screen.js";
import fallbackHandler from "../lib/twilio/voice.js";

const handlers = {
  voice: voiceHandler,
  sms: smsHandler,
  status: statusHandler,
  screen: screenHandler,
  fallback: fallbackHandler,
};

export default async function handler(req, res) {
  // 1. Get action from query, OR auto-detect from Twilio headers
  let action = req.query?.action;

  if (!action) {
    if (req.body?.CallSid || req.query?.CallSid) {
      action = "voice"; // Incoming phone call
    } else if (req.body?.MessageSid || req.body?.SmsSid) {
      action = "sms"; // Incoming text message
    } else {
      action = "voice"; // Default to voice
    }
  }

  const fn = handlers[action];
  if (!fn) {
    return res.status(404).json({ error: "Unknown twilio action", action: action || null });
  }
  return fn(req, res);
}
