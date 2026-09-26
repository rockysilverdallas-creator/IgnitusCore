// Vercel Serverless Function: Ghost Form / Incomplete Form Recovery API
// Route: /api/ghost_form
// Mechanism 1: "Ghost Form" / Incomplete Form Recovery (Website Leak)
// Captures onBlur phone numbers before form submission and fires low-pressure SMS recovery via Twilio.

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
      status: "ARMED_AND_ACTIVE",
      description: "Captures onBlur phone entry and fires automated 90s recovery SMS via Twilio."
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      phone = "",
      name = "Neighbor",
      trade = "Service Inquiry",
      page_url = "https://ignituscore.com"
    } = req.body || {};

    if (!phone || phone.replace(/\D/g, "").length < 10) {
      return res.status(400).json({ error: "Valid mobile phone number required" });
    }

    const cleanPhone = phone.startsWith("+") ? phone : `+1${phone.replace(/\D/g, "")}`;
    const recoveryMsg = `Hey ${name}, saw you were checking on an estimate with Ignitus Core in Shreveport. Did your page freeze, or did you still need help today?`;

    const smsSent = await sendTwilioSMS(cleanPhone, recoveryMsg);

    // Log telemetry into bleed_posture_matrix via Cloud Run
    try {
      fetch(CLOUD_RUN_SHAER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: name,
          contact_phone: cleanPhone,
          trade_sector: trade,
          inquiry: `Ghost Form Recovery: User entered phone on ${page_url} without clicking submit. SMS recovery dispatched.`,
          source: "ghost_form_abandonment_recovery",
          v_bleed_recovered: 1450,
          timestamp_utc: new Date().toISOString()
        })
      }).catch(() => {});
    } catch (_) {}

    return res.status(200).json({
      status: "SUCCESS",
      mechanism: "GHOST_FORM_RECOVERY",
      phone: cleanPhone,
      sms_dispatched: smsSent,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return res.status(500).json({
      error: "Ghost Form Handler Error",
      details: error.message
    });
  }
}
