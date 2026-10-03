// Consolidated Twilio webhook dispatcher — 5 endpoints, 1 function.
// Vercel rewrite: /api/twilio/:action -> /api/twilio?action=:action
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
  const action = req.query?.action;
  const fn = handlers[action];
  if (!fn) {
    return res.status(404).json({ error: "Unknown twilio action", action: action || null });
  }
  return fn(req, res);
}
