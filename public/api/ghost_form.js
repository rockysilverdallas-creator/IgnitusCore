// Vercel Serverless Function: Ghost Form / Incomplete Form Recovery API
// Route: /api/ghost_form
// Mechanism 1: Incomplete Form Recovery (Website Leak)
// GATED: Only sends SMS if prior opt-in consent exists for the mobile number.
// Unconsented abandonments are logged to telemetry without texting.

import fs from "fs";
import path from "path";

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

const CLOUD_RUN_SHAER_URL = process.env.CLOUD_RUN_SHAER_URL || "https://ignitus-shaer-fauxnyn7sa-uc.a.run.app/api/action/dispatch";
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM_NUMBER = process.env.TWILIO_FROM_NUMBER || "+18333454785";

// Shared consent store
globalThis.CONSENTED_PHONES = globalThis.CONSENTED_PHONES || new Set();

async function sendTwilioSMS(toPhone, messageBody) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) return false;
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");
  const params = new URLSearchParams({
    To: toPhone,
    From: TWILIO_FROM_NUMBER,
    Body: messageBody
  });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });
    return res.ok;
  } catch (err) {
    console.error("[GHOST FORM TWILIO ERR]", err);
    return false;
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({
      service: "GHOST_FORM_RECOVERY_ENGINE",
      status: "ACTIVE",
      consent_gate_enabled: true,
      description: "Captures onBlur phone entry. Logs abandonment telemetry; SMS dispatch requires prior opt-in consent."
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      phone = "",
      name = "Visitor",
      trade = "Service Inquiry",
      page_url = "https://ignituscore.com"
    } = req.body || {};

    if (!phone || phone.replace(/\D/g, "").length < 10) {
      return res.status(400).json({ error: "Valid mobile phone number required" });
    }

    const cleanPhone = phone.startsWith("+") ? phone : `+1${phone.replace(/\D/g, "")}`;
    const timestamp = new Date().toISOString();

    // STRICT CONSENT GATE CHECK: NO PRIOR OPT-IN = NO TEXT
    const hasConsent = globalThis.CONSENTED_PHONES.has(cleanPhone);

    let smsSent = false;
    let gateReason = "NO_PRIOR_OPT_IN_CONSENT";

    if (hasConsent) {
      const recoveryMsg = `Hey ${name}, saw you were checking on an estimate with Ignitus Core in Shreveport. Did your page freeze, or did you still need help today?`;
      smsSent = await sendTwilioSMS(cleanPhone, recoveryMsg);
      gateReason = "CONSENT_VERIFIED_SMS_DISPATCHED";
    } else {
      console.log(`[GHOST FORM CONSENT GATE] ${cleanPhone} has no prior opt-in consent. SMS blocked, logging abandonment telemetry.`);
    }

    // Always log abandonment telemetry to Cloud Run / Sovereign Ledger
    try {
      fetch(CLOUD_RUN_SHAER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: name,
          contact_phone: cleanPhone,
          trade_sector: trade,
          inquiry: `Ghost Form Abandonment on ${page_url} (Consent Status: ${hasConsent ? "OPTED_IN" : "GATED_NO_OPT_IN"})`,
          source: "ghost_form_abandonment",
          v_bleed_recovered: hasConsent ? 1450 : 0,
          timestamp_utc: timestamp
        })
      }).catch(() => {});
    } catch (_) {}

    return res.status(200).json({
      status: hasConsent ? "SUCCESS" : "ABANDONMENT_LOGGED",
      mechanism: "GHOST_FORM_RECOVERY",
      phone: cleanPhone,
      sms_dispatched: smsSent,
      consent_gate_status: gateReason,
      timestamp
    });

  } catch (error) {
    return res.status(500).json({
      error: "Ghost Form Handler Error",
      details: error.message
    });
  }
}
