// Vercel Serverless Function: Google Business Profile (GBP) & "Request a Quote" Webhook Router
// Route: /api/gbp_quote
// Mechanism 2: Google Business Profile (GBP) & "Request a Quote" Routing
// Sub-60-second response asking 1 qualification question + real-time owner alert SMS.

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
const OWNER_ALERT_PHONE = process.env.OWNER_ALERT_PHONE || "+18333454785";

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
    console.error("[GBP TWILIO SMS ERR]", err);
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
      service: "GBP_QUOTE_ROUTER",
      status: "ARMED_AND_ACTIVE",
      description: "Ingests Google Business Messages / GBP quote requests, dispatches instant SMS triage & owner alert."
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      sender_name = "Google User",
      phone = "",
      message = "",
      service_requested = "General Quote",
      location = "Shreveport"
    } = req.body || {};

    const cleanPhone = phone ? (phone.startsWith("+") ? phone : `+1${phone.replace(/\D/g, "")}`) : null;
    const timestamp = new Date().toISOString();

    let smsCustomerSent = false;
    let smsOwnerSent = false;

    // 1. Instant Automated Sub-60s Qualification Response to Lead (if phone provided)
    if (cleanPhone) {
      const qualificationMsg = `Hey ${sender_name}! Thanks for reaching out via Google for Ignitus Core in ${location}. What is the main issue or service you need help with today?`;
      smsCustomerSent = await sendTwilioSMS(cleanPhone, qualificationMsg);
    }

    // 2. Real-time Alert to Business Owner
    const ownerAlertMsg = `🚨 HOT GBP LEAD! ${sender_name} requested a quote on Google (${location}). Msg: "${message || service_requested}". Phone: ${cleanPhone || "Check GBP Console"}`;
    smsOwnerSent = await sendTwilioSMS(OWNER_ALERT_PHONE, ownerAlertMsg);

    // 3. Telemetry Dispatch to Cloud Run / Bleed Posture Matrix
    try {
      fetch(CLOUD_RUN_SHAER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: sender_name,
          contact_phone: cleanPhone || "GBP_MESSAGING",
          trade_sector: service_requested,
          inquiry: `Google Business Profile Quote Request: "${message || service_requested}" in ${location}. Sub-60s triage fired.`,
          source: "gbp_request_quote_routing",
          v_bleed_recovered: 1450,
          timestamp_utc: timestamp
        })
      }).catch(() => {});
    } catch (_) {}

    return res.status(200).json({
      status: "SUCCESS",
      mechanism: "GBP_QUOTE_ROUTER",
      sender_name,
      customer_sms_dispatched: smsCustomerSent,
      owner_alert_dispatched: smsOwnerSent,
      timestamp
    });

  } catch (error) {
    return res.status(500).json({
      error: "GBP Router Handler Error",
      details: error.message
    });
  }
}
