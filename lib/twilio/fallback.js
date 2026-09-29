// Vercel Serverless Function: Zero-Leak Triage & Delivery Ledger Ingestion
// Route: /api/twilio/fallback
// Architecture: 14s Unanswered Voicemail Capture -> Neural Recording -> SHAER Cloud Run & BigQuery Ledger ($55.00 Unit)

const BACKEND_DISPATCH_URL = process.env.CLOUD_RUN_SHAER_URL || "https://ignitus-shaer-fauxnyn7sa-uc.a.run.app/api/action/dispatch";
const PROJECT_ID = process.env.GCP_PROJECT_ID || "ignitus-d1e7b";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "text/xml");

  const callerNumber = req.body?.From || req.query?.From || "Unknown";
  const callSid = req.body?.CallSid || req.query?.CallSid || `call_${Date.now()}`;
  const recordingUrl = req.body?.RecordingUrl || "";
  const transcriptText = req.body?.TranscriptionText || "";

  // Callback once recording/transcription completes
  if (recordingUrl || transcriptText) {
    const deliveryPayload = {
      project_id: PROJECT_ID,
      delivery_id: `DEL-${Date.now()}-${callSid.slice(-4)}`,
      action: "voice_intake_captured",
      channel: "VOICE_SCREENED_DISPATCH",
      caller_phone: callerNumber,
      recording_url: recordingUrl,
      transcript: transcriptText,
      unit_cost_usd: 55.00,
      timestamp: new Date().toISOString()
    };

    try {
      fetch(BACKEND_DISPATCH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deliveryPayload)
      }).catch(() => {});
    } catch (_) {}

    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>`);
  }

  // Caller prompt if line not answered within 14 seconds
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Danielle-Neural">
    All technicians and dispatchers are currently on active calls. 
    Your inquiry is of high priority. Please leave your name, address, and the nature of your repair or service after the tone.
    Your dispatch ticket will be transmitted immediately.
  </Say>
  <Record 
    maxLength="120" 
    timeout="10" 
    playBeep="true" 
    transcribe="true" 
    transcribeCallback="/api/twilio/fallback" 
    action="/api/twilio/fallback" 
    method="POST" 
  />
  <Say voice="Polly.Danielle-Neural">Thank you. Your dispatch ticket is locked and on its way.</Say>
  <Hangup/>
</Response>`;

  return res.status(200).send(twiml);
}
