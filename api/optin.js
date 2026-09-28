// Vercel / Node Serverless Endpoint: SMS Opt-In Consent & Evidence Generator
// Path: api/optin.js
// Specification: Strictly handles explicit web opt-in consent with persistent rate-limiting, deduplication, STOP list suppression, and full evidence audit logging.
// Disk-backed persistence ensures STOP suppression and rate limits survive container restarts.

import crypto from "crypto";
import fs from "fs";
import path from "path";
import os from "os";

// Load local environment variables if available
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
// Renamed disclosure version: no longer riding on rejected Trust Hub profile name
const DISCLOSURE_VERSION = "v2026.09.26-A2P-DIRECT-CONSENT-v1";

// Persistent File-backed Store Configuration
const STORE_DIR = path.resolve(process.cwd(), "data");
const STORE_FILE = path.resolve(STORE_DIR, "optin_persistent_store.json");

// In-memory stores initialized from persistent storage
globalThis.RATE_LIMIT_STORE = globalThis.RATE_LIMIT_STORE || new Map();
globalThis.CONSENT_EVIDENCE_STORE = globalThis.CONSENT_EVIDENCE_STORE || new Map();
globalThis.STOP_SUPPRESSION_LIST = globalThis.STOP_SUPPRESSION_LIST || new Set();

// Helper: Load persistent state from disk to survive restarts
function loadPersistentStore() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, "utf8");
      const data = JSON.parse(raw);
      if (Array.isArray(data.stop_list)) {
        globalThis.STOP_SUPPRESSION_LIST = new Set(data.stop_list);
      }
      if (data.rate_limits && typeof data.rate_limits === "object") {
        globalThis.RATE_LIMIT_STORE = new Map(Object.entries(data.rate_limits));
      }
      if (data.consent_records && typeof data.consent_records === "object") {
        globalThis.CONSENT_EVIDENCE_STORE = new Map(Object.entries(data.consent_records));
      }
    }
  } catch (err) {
    console.error("[OPTIN STORE LOAD ERR]", err.message);
  }
}

// Helper: Save current state to disk
function savePersistentStore() {
  try {
    if (!fs.existsSync(STORE_DIR)) {
      fs.mkdirSync(STORE_DIR, { recursive: true });
    }
    const payload = {
      stop_list: Array.from(globalThis.STOP_SUPPRESSION_LIST || []),
      rate_limits: Object.fromEntries(globalThis.RATE_LIMIT_STORE || new Map()),
      consent_records: Object.fromEntries(globalThis.CONSENT_EVIDENCE_STORE || new Map()),
      last_persisted: new Date().toISOString()
    };
    fs.writeFileSync(STORE_FILE, JSON.stringify(payload, null, 2), "utf8");
  } catch (err) {
    console.error("[OPTIN STORE SAVE ERR]", err.message);
  }
}

// Load persistent store on module load
loadPersistentStore();

// Helper: E.164 Phone Normalization
function normalizeE164(phoneStr) {
  if (!phoneStr) return null;
  const digits = phoneStr.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (phoneStr.startsWith("+") && digits.length >= 10) return `+${digits}`;
  return null;
}

// Helper: Anonymized IP Hashing
function hashIP(ipStr) {
  if (!ipStr) return "anon_000000000000";
  return crypto.createHash("sha256").update(ipStr).digest("hex").substring(0, 16);
}

// Helper: Rate Limiter (Max 5 requests per 15 minutes per IP/Phone)
function checkRateLimit(identifier) {
  loadPersistentStore();
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxRequests = 5;

  const record = globalThis.RATE_LIMIT_STORE.get(identifier) || { count: 0, resetTime: now + windowMs };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
  } else {
    record.count += 1;
  }

  globalThis.RATE_LIMIT_STORE.set(identifier, record);
  savePersistentStore();
  return record.count <= maxRequests;
}

export default async function handler(req, res) {
  loadPersistentStore();

  // Set CORS headers for safe origin requests
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

  // Health check endpoint
  if (req.method === "GET") {
    return res.status(200).json({
      service: "OPTIN_CONSENT_REGISTRY",
      status: "ACTIVE",
      disclosure_version: DISCLOSURE_VERSION,
      persistence: "DISK_BACKED",
      total_consented_records: globalThis.CONSENT_EVIDENCE_STORE.size,
      stop_suppression_count: globalThis.STOP_SUPPRESSION_LIST.size
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const clientIP = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "Unknown Browser";
    const body = req.body || {};

    const fullName = (body.fullName || body.name || "").trim();
    const rawMobile = body.mobile || body.phone || "";
    const smsConsent = body.smsConsent === true || body.smsConsent === "true" || body.consent === true;
    const pageUrl = body.page_url || "https://ignituscore.com/optin/";

    // 1. INPUT VALIDATION
    if (!fullName) {
      return res.status(400).json({
        success: false,
        error: "VALIDATION_FAILED",
        message: "Full name is required."
      });
    }

    const cleanPhone = normalizeE164(rawMobile);
    if (!cleanPhone) {
      return res.status(400).json({
        success: false,
        error: "INVALID_PHONE_FORMAT",
        message: "A valid 10-digit US mobile number is required (e.g., 3185550199)."
      });
    }

    // 2. REQUIRED CONSENT CHECKBOX GATE
    if (!smsConsent) {
      return res.status(400).json({
        success: false,
        error: "CONSENT_REQUIRED",
        message: "SMS consent checkbox must be explicitly checked prior to subscription."
      });
    }

    // 3. RATE LIMITING
    const ipHash = hashIP(clientIP);
    if (!checkRateLimit(ipHash) || !checkRateLimit(cleanPhone)) {
      return res.status(429).json({
        success: false,
        error: "RATE_LIMIT_EXCEEDED",
        message: "Too many subscription attempts. Please try again in 15 minutes."
      });
    }

    // 4. STOP LIST SUPPRESSION CHECK
    if (globalThis.STOP_SUPPRESSION_LIST.has(cleanPhone)) {
      return res.status(409).json({
        success: false,
        error: "SUPPRESSED_OPT_OUT",
        message: "This mobile number previously opted out (STOP). Text START to (833) 345-4785 to re-enable messages."
      });
    }

    // 5. IDEMPOTENCY & DEDUPLICATION (Deduplicate identical requests within 5 minutes)
    const dedupKey = crypto.createHash("sha256").update(`${cleanPhone}_${DISCLOSURE_VERSION}`).digest("hex");
    const existingRecord = globalThis.CONSENT_EVIDENCE_STORE.get(dedupKey);

    const now = new Date();
    const timestampIso = now.toISOString();
    const requestId = `optin_req_${now.getTime()}_${crypto.randomBytes(4).toString("hex")}`;

    if (existingRecord && (now.getTime() - new Date(existingRecord.timestamp).getTime() < 5 * 60 * 1000)) {
      return res.status(200).json({
        success: true,
        status: "DEDUPLICATED",
        message: "Consent record already registered and up to date.",
        evidence: existingRecord
      });
    }

    // 6. CONSENT EVIDENCE AUDIT PACKAGE
    const evidencePackage = {
      request_id: requestId,
      phone: cleanPhone,
      name: fullName,
      timestamp: timestampIso,
      page_url: pageUrl,
      disclosure_version: DISCLOSURE_VERSION,
      consent_type: "EXPLICIT_WEB_CHECKBOX",
      ip_hash: ipHash,
      user_agent: userAgent
    };

    // Store evidence locally & persist
    globalThis.CONSENT_EVIDENCE_STORE.set(dedupKey, evidencePackage);
    savePersistentStore();

    // 7. TELEMETRY & SOVEREIGN LEDGER DISPATCH (BigQuery Ingestion)
    try {
      fetch(CLOUD_RUN_SHAER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: fullName,
          contact_phone: cleanPhone,
          trade_sector: "SMS Opt-In Compliance",
          inquiry: `Explicit Web Consent Registered on ${pageUrl}`,
          source: "web_optin_form",
          request_id: requestId,
          disclosure_version: DISCLOSURE_VERSION,
          v_bleed_recovered: 0,
          timestamp_utc: timestampIso
        })
      }).catch(() => {});
    } catch (_) {}

    return res.status(200).json({
      success: true,
      status: "CONSENT_REGISTERED",
      message: "Consent recorded successfully. Mobile number registered for Ignitus Core communications.",
      evidence: evidencePackage
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: error.message
    });
  }
}
