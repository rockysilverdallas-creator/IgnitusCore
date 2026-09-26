// Vercel Serverless Function: Twilio Status Callback Webhook
// Route: /api/twilio/status
// Tracks call progress (initiated, ringing, answered, completed, no-answer)
// Feeds telemetry directly into Agent SHAH / SHAER diagnostic mesh

const CLOUD_RUN_SHAER_URL = "https://ignitus-shaer-fauxnyn7sa-uc.a.run.app/api/action/dispatch";

export default async function handler(req, res) {
  const callSid = req.body?.CallSid || req.query?.CallSid || "unknown";
  const callStatus = req.body?.CallStatus || req.query?.CallStatus || "unknown";
  const duration = req.body?.CallDuration || req.query?.CallDuration || "0";
  const from = req.body?.From || req.query?.From || "unknown";
  const to = req.body?.To || req.query?.To || "unknown";
  const timestamp = new Date().toISOString();

  console.log(`[TWILIO STATUS] CallSid: ${callSid} | Status: ${callStatus} | From: ${from} | To: ${to} | Duration: ${duration}s`);

  // If call was missed or unanswered, flag telemetry for Agent SHAH
  if (["no-answer", "busy", "failed"].includes(callStatus.toLowerCase()) && from !== "unknown") {
    try {
      fetch(CLOUD_RUN_SHAER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: "Missed Call Alert",
          contact_phone: from,
          trade_sector: "Missed Call Telemetry",
          inquiry: `Unanswered inbound call detected (Status: ${callStatus}, Duration: ${duration}s). Trigger Echo Blaze SMS triage.`,
          source: "twilio_voice_missed_call",
          timestamp_utc: timestamp
        })
      }).catch(err => console.error("Agent SHAH status telemetry err:", err.message));
    } catch (e) {
      // non-blocking
    }
  }

  // Return 200 OK to acknowledge Twilio status callback
  return res.status(200).json({
    received: true,
    callSid,
    callStatus,
    telemetry_logged: true,
    timestamp
  });
}
