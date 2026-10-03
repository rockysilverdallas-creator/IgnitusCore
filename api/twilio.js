// Consolidated Twilio webhook dispatcher — 5 endpoints, 1 function.
// Fix 2026-10-03: status callbacks carry CallSid too — CallStatus is now
// checked FIRST so they route to status, not voice.
import voiceHandler from "../lib/twilio/voice.js";
import smsHandler from "../lib/twilio/sms.js";
import statusHandler from "../lib/twilio/status.js";
import screenHandler from "../lib/twilio/screen.js";

const handlers = {
  voice: voiceHandler,
  sms: smsHandler,
  status: statusHandler,
  screen: screenHandler,
  fallback: voiceHandler,
};

export default async function handler(req, res) {
  // 1. Get action from query, OR auto-detect from Twilio payload
  let action = req.query?.action;

  if (!action) {
    const body = req.body || {};
    const query = req.query || {};
    if (body.CallStatus || query.CallStatus) {
      action = "status"; // Status callback — check BEFORE CallSid
    } else if (body.CallSid || query.CallSid) {
      action = "voice"; // Incoming phone call
    } else if (body.MessageSid || body.SmsSid) {
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
