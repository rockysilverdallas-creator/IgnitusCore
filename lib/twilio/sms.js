// Vercel Serverless Function: Twilio SMS Webhook
// Route: /api/twilio/sms
// Handles SHIELD / DEMO keywords + forwards all texts to Sylvester (945-353-5789)
// and synchronizes with Agent SHAH / SHAER (Cloud Run: ignitus-497415)

const CLOUD_RUN_SHAER_URL = "https://ignitus-shaer-fauxnyn7sa-uc.a.run.app/api/action/dispatch";
const PERSONAL_NUMBER      = "+19453535789";
const TOLL_FREE            = "(833) 345-4785";
const SHIELD_URL           = "https://ignituscore.com";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "text/xml");

  const rawBody    = req.body?.Body    || req.query?.Body    || "";
  const fromNumber = req.body?.From    || req.query?.From    || "Unknown";
  const keyword    = rawBody.trim().toUpperCase();

  // ── Keyword: SHIELD ────────────────────────────────────────────────
  if (keyword === "SHIELD") {
    // Fire-and-forget: notify Sly + dispatch to Cloud Run
    _dispatchToShah(fromNumber, "SHIELD activation request", "Weekend Shield Intake");

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message to="${PERSONAL_NUMBER}">
🛡️ [SHIELD ACTIVATION]
From: ${fromNumber}
Keyword: SHIELD — Queue for Weekend Deployment.
  </Message>
  <Message>
✅ Weekend Shield queued. Tiana AI will answer your calls on ring 2 starting Friday 5 PM CST through Monday 8 AM.

Deploy now → ${SHIELD_URL}
Or dial ${TOLL_FREE} to hear Tiana answer live.

— Ignitus Core
  </Message>
</Response>`;
    return res.status(200).send(twiml);
  }

  // ── Keyword: DEMO ──────────────────────────────────────────────────
  if (keyword === "DEMO") {
    _dispatchToShah(fromNumber, "DEMO request", "Live Demo Triage");

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message to="${PERSONAL_NUMBER}">
📞 [DEMO REQUEST]
From: ${fromNumber}
Keyword: DEMO — Prospect wants live demo.
  </Message>
  <Message>
📞 Call ${TOLL_FREE} RIGHT NOW — Tiana AI picks up on ring two.

That's your live demo. No sales pitch. No hold music. Just what your weekend could sound like.

Deploy the $50 Shield → ${SHIELD_URL}

— Ignitus Core
  </Message>
</Response>`;
    return res.status(200).send(twiml);
  }

  // ── All other messages — general inbound triage ───────────────────
  _dispatchToShah(fromNumber, rawBody, "SMS Inbound Triage");

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message to="${PERSONAL_NUMBER}">
[IGNITUS LEAD ALERT]
From: ${fromNumber}
Msg: ${rawBody}
  </Message>
  <Message>
Ignitus Core received your message. Our 24/7 intake team has been dispatched.

To deploy the $50 Weekend Shield: text SHIELD to ${TOLL_FREE}
To hear a live demo: text DEMO to ${TOLL_FREE}

— Tiana AI @ Ignitus Core
  </Message>
</Response>`;

  return res.status(200).send(twiml);
}

// ── Shared Cloud Run dispatcher (non-blocking) ───────────────────────
function _dispatchToShah(phone, inquiry, sector) {
  try {
    fetch(CLOUD_RUN_SHAER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_name: "Inbound SMS Prospect",
        contact_phone: phone,
        trade_sector: sector,
        inquiry,
        source: "twilio_sms_webhook",
        timestamp_utc: new Date().toISOString(),
      }),
    }).catch((err) => console.error("[SMS → Cloud Run error]:", err.message));
  } catch (_) {
    // non-blocking — swallow
  }
}
