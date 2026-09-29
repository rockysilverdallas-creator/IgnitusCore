// Vercel Serverless Function: Twilio Call Screening Whisper
// Route: /api/twilio/screen
// Whispers to Sylvester when his phone rings. If carrier voicemail answers, it cannot press 1,
// so Twilio immediately routes the caller to the Ignitus Core executive voicemail instead.

export default async function handler(req, res) {
  res.setHeader("Content-Type", "text/xml");

  const digits = req.body?.Digits || req.query?.Digits;

  // If Sylvester pressed 1, connect the call!
  if (digits === "1") {
    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response/>`);
  }

  // Whisper prompt played ONLY to Sylvester's ear when he picks up
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather numDigits="1" timeout="5">
        <Say voice="Polly.Danielle-Neural">Ignitus Core executive call. Press 1 to connect.</Say>
    </Gather>
    <Hangup/>
</Response>`;

  return res.status(200).send(twiml);
}
