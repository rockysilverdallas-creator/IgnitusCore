// Consolidated Twilio webhook dispatcher — 5 endpoints, 1 function.
// Fix 2026-10-03 (rev 2): REVERTED the CallStatus-first check. The voice
// webhook ("A call comes in") sends CallSid AND CallStatus=ringing, so
// checking CallStatus first routed live calls to the status handler, which
// returns JSON instead of TwiML -> Twilio played "application error".
// Deterministic routing: set the Twilio console URLs with explicit actions:
//   Voice URL:      /api/twilio?action=voice
//   Status callback: /api/twilio?action=status
// Auto-detect below is only the fallback when no action param is present.
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
  // 1. Explicit action param wins — this is the deterministic route.
  let action = req.query?.action;

  // 2. Fallback auto-detect: a CallSid with no action param is an incoming
  //    call -> voice. (Status callbacks must use ?action=status.)
  if (!action) {
    const body = req.body || {};
    const query = req.query || {};
    if (body.CallSid || query.CallSid) {
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
