// Twilio Voice Fallback Handler
export default async function handler(req, res) {
  res.setHeader("Content-Type", "text/xml");
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Danielle-Neural">
        Thank you for calling Ignitus Core. Our emergency triage line is currently logging your number. 
        Sylvester and the on-call field team have received your dispatch inquiry and will call you right back.
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
