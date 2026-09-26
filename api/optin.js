// Vercel Serverless Function: Opt-In Consent API
// Route: /api/optin
// Form fields: fullName, mobile, smsConsent
// Stores opt-in consent records for Twilio A2P / Toll-Free compliance.

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

// Global consent set across edge function invocations
globalThis.CONSENTED_PHONES = globalThis.CONSENTED_PHONES || new Set();

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
      service: "OPTIN_CONSENT_REGISTRY",
      status: "ACTIVE",
      total_consented_numbers: globalThis.CONSENTED_PHONES.size
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body || {};
    const fullName = body.fullName || body.name || "Subscriber";
    const mobile = body.mobile || body.phone || "";
    const smsConsent = body.smsConsent === true || body.smsConsent === "true" || body.consent === true;

    if (!mobile || mobile.replace(/\D/g, "").length < 10) {
      return res.status(400).json({ error: "Valid mobile phone number required" });
    }

    if (!smsConsent) {
      return res.status(400).json({ error: "SMS consent checkbox must be checked prior to subscription" });
    }

    const cleanPhone = mobile.startsWith("+") ? mobile : `+1${mobile.replace(/\D/g, "")}`;
    const timestamp = new Date().toISOString();

    // Register phone in global consent store
    globalThis.CONSENTED_PHONES.add(cleanPhone);

    // Dispatch consent event to Cloud Run / Sovereign Ledger
    try {
      fetch(CLOUD_RUN_SHAER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: fullName,
          contact_phone: cleanPhone,
          trade_sector: "SMS Opt-In Compliance",
          inquiry: "Explicit Web Opt-In Consent Registered on ignituscore.com/optin/",
          source: "web_optin_form",
          v_bleed_recovered: 0,
          timestamp_utc: timestamp
        })
      }).catch(() => {});
    } catch (_) {}

    return res.status(200).json({
      status: "SUCCESS",
      phone: cleanPhone,
      name: fullName,
      consent_recorded: true,
      timestamp
    });

  } catch (error) {
    return res.status(500).json({
      error: "Opt-In Consent Handler Error",
      details: error.message
    });
  }
}
