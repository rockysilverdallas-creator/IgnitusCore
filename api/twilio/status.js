// Vercel Serverless Function: Twilio Status Callback & 3-Second Drop Triage
// Route: /api/twilio/status
// Mechanism 3: "Hang-Up Before Voicemail" Trap & Short Drop Recovery Callback
// Automatically dispatches rapid triage SMS when callers hang up in under 10 seconds.

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
    console.error("[TWILIO SMS ERR]", err);
    return false;
  }
}

export default async function handler(req, res) {
  const callSid = req.body?.CallSid || req.query?.CallSid || "unknown";
  const callStatus = req.body?.CallStatus || req.query?.CallStatus || "unknown";
  const duration = parseInt(req.body?.CallDuration || req.query?.CallDuration || "0", 10);
  const from = req.body?.From || req.query?.From || "unknown";
  const to = req.body?.To || req.query?.To || "unknown";
  const timestamp = new Date().toISOString();

  console.log(`[TWILIO STATUS TRACE] CallSid: ${callSid} | Status: ${callStatus} | From: ${from} | To: ${to} | Duration: ${duration}s`);

  let autoSmsTriggered = false;

  // MECHANISM 3: If caller hangs up under 10 seconds or missed call without voicemail
  if (from !== "unknown" && (duration < 10 || ["no-answer", "busy", "failed"].includes(callStatus.toLowerCase()))) {
    const triageMessage = "Sorry we couldn't grab the line! We're currently on a job in Shreveport—is this an urgent service need?";
    autoSmsTriggered = await sendTwilioSMS(from, triageMessage);

    // Telemetry dispatch to Cloud Run / Firebase Mesh
    try {
      fetch(CLOUD_RUN_SHAER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: "3-Second Drop Caller",
          contact_phone: from,
          trade_sector: "Short Call Drop Recovery",
          inquiry: `Inbound caller dropped after ${duration}s (Status: ${callStatus}). Auto SMS triage dispatched.`,
          source: "twilio_3sec_drop_trap",
          v_bleed_recovered: 1450,
          timestamp_utc: timestamp
        })
      }).catch(err => console.error("Telemetry error:", err.message));
    } catch (_) {}
  }

  return res.status(200).json({
    received: true,
    mechanism: "3_SECOND_DROP_TRAP",
    callSid,
    callStatus,
    durationSeconds: duration,
    auto_sms_triggered: autoSmsTriggered,
    timestamp
  });
}
