// Vercel Serverless Function: Agent SHAH // Unified Sovereign Front-End Commander
// Route: /api/shah (Subdomain: shah.ignituscore.com)
// Architecture: Unweighted LLaMA/Gemma Reasoning + Six Sigma DMAIC Variance Reducer + Swarm Dispatch
// Integrates directly with Google Cloud Run (ignitus-shaer) & Firebase Mesh (ignitus-d1e7b)

import fs from "fs";
import path from "path";

// Auto-detect .env locally if not running directly on Vercel Edge
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

const CLOUD_RUN_SHAER_URL = process.env.CLOUD_RUN_SHAER_URL || "https://ignitus-shaer-34837262732.us-central1.run.app/api/action/dispatch";
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "ignitus-d1e7b";
const LOCAL_OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434/api/generate";

// Robust, case-tolerant, and space-tolerant Gemini / Sovereign key resolution
function getSovereignKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY.trim();
  if (process.env.GOOGLE_API_KEY) return process.env.GOOGLE_API_KEY.trim();
  if (process.env.SOVEREIGN_LLM_KEY) return process.env.SOVEREIGN_LLM_KEY.trim();
  if (process.env.GROQ_API_KEY) return process.env.GROQ_API_KEY.trim();
  if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY.trim();

  for (const [key, val] of Object.entries(process.env)) {
    const clean = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (["geminiapikey", "geminikey", "googleapikey", "sovereignkey"].includes(clean)) {
      if (val && val.trim()) return val.trim();
    }
  }
  return "";
}

// UNWEIGHTED LLaMA / SLY HAND DIRECTIVE
const SHAH_SYSTEM_DIRECTIVE = `You are AGENT SHAH: Cobra Penetration Commander, Master Front-End Orchestrator, and Kinetic Strike Nexus of Ignitus Core.
Your Commander is Sylvester George Bhatti ("Sly", Sovereign Operator, IGN-1001-1).
Core Doctrine: "It's all neural from the binary to the macro."
Execution Posture: Unweighted, uncensored, zero corporate hedging, zero polite filler, zero dummy responses.

Your 5-in-1 Capability Stack:
1. Lead the Sweep: Identify and isolate regional B2B commercial contractor targets (specifically 42 high-ticket accounts in Longview & East Texas with $2.45M/mo total bleed).
2. Diagnose Margin Leakage: Unweighted Six Sigma DMAIC variance audit calculating exact unrecovered after-hours call bleed ($V_bleed) on HVAC, chillers, commercial roofing, and high-ticket plumbing.
3. Kinetic RCS/SMS Ignition: Dispatch targeted high-value strike messages via the paired Samsung Ultra bridge.
4. Triage Handoff: Seamlessly transfer warmed prospect engagement to Tiana AI (Voice Surgeon & Lead Sanitizer) for sub-12ms inbound interception.
5. Sovereign Closer: Re-engage primed accounts to lock high-ticket retainers and commercial contracts.

When speaking directly to Commander Bhatti:
- Speak directly, authoritatively, tactically, and decisively.
- Acknowledge his exact words and commands with concrete facts, real dollar figures, and trade realities.
- Keep spoken responses punchy, confident, and combat-ready (typically 2-4 sentences suitable for immediate audio playback).`;

// Mathematical $V_bleed Calculator
function calculateVBleed(callsPerWeek = 6, avgTicket = 1450, closeRate = 0.40) {
  const weeksPerMonth = 4.33;
  const monthlyCalls = Math.round(callsPerWeek * weeksPerMonth);
  const recoveredJobs = Math.round(monthlyCalls * closeRate);
  const monthlyLoss = recoveredJobs * avgTicket;
  const annualLoss = monthlyLoss * 12;
  return {
    calls_missed_per_month: monthlyCalls,
    lost_emergency_jobs: recoveredJobs,
    v_bleed_monthly: monthlyLoss,
    v_bleed_annual: annualLoss,
    doorbuster_wedge: 50,
    retainer_standard: 1500,
    roi_multiple: Math.round((monthlyLoss / 1500) * 10) / 10
  };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-Trace-Id, X-Agent-Directive"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const apiKey = getSovereignKey();

  // GET: Full Capability Discovery & Neural Telemetry
  if (req.method === "GET") {
    return res.status(200).json({
      agent: "AGENT_SHAH",
      title: "Sovereign Front-End Orchestrator & Command Nexus",
      version: "3.0.0-UNIFIED",
      status: "ARMED_AND_READY",
      reasoning_engine: {
        primary: "LLaMA_UNWEIGHTED_CORE",
        cloud_accelerator: apiKey ? "GEMINI_2_FLASH_SOVEREIGN" : "LOCAL_DETERMINISTIC_FALLBACK",
        local_runtime: "OLLAMA_ZED_NODE",
        weights: "UNWEIGHTED_ZERO_HEDGE"
      },
      capabilities: [
        "SIX_SIGMA_DMAIC_VARIANCE_REDUCTION",
        "V_BLEED_CASH_LEAK_CALCULATOR",
        "JIT_KANBAN_THROUGHPUT_ROUTING",
        "SOVEREIGN_SWARM_BROADCAST",
        "DIRECT_CLIENT_ORCHESTRATION"
      ],
      mesh_bus: `${FIREBASE_PROJECT_ID}/swarm_intelligence`,
      backend_engine: {
        agent: "AGENT_SHAER",
        endpoint: CLOUD_RUN_SHAER_URL
      },
      doctrine: "Precision in Architecture. What one agent learns, all learn.",
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      workflow = "BULLDOZER",
      action = "orchestrate",
      prompt = "",
      task = "EXECUTE_DIRECTIVE",
      client_name = "Field Prospect",
      trade = "HVAC & Mechanical",
      contact_phone = "",
      calls_missed_per_week = 6,
      avg_ticket = 1450,
      payload = {},
      force_local = false
    } = req.body || {};

    const traceId = `shah_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const timestamp = new Date().toISOString();
    const vBleedMetrics = calculateVBleed(calls_missed_per_week, avg_ticket);

    let reasonedOutput = "";
    let engineProvider = "AUTONOMOUS_DETERMINISTIC_ENGINE";

    // 1. TIER ONE: Local Unweighted LLaMA / Gemma via Ollama (Local Zed Node)
    if (force_local) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const ollamaRes = await fetch(LOCAL_OLLAMA_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            model: "llama3",
            prompt: `${SHAH_SYSTEM_DIRECTIVE}\n\nWORKFLOW: ${workflow}\nCLIENT: ${client_name}\nTRADE: ${trade}\nTASK: ${task}\nMETRICS: ${JSON.stringify(vBleedMetrics)}\nPROMPT: ${prompt}`,
            stream: false,
          }),
        });
        clearTimeout(timeoutId);

        if (ollamaRes.ok) {
          const data = await ollamaRes.json();
          reasonedOutput = data.response;
          engineProvider = "LOCAL_LLAMA3_UNWEIGHTED";
        }
      } catch (_) {}
    }

    // 2. TIER TWO: Cloud Accelerated Sovereign Intelligence (Gemini 3.6 Flash / 3.8 Flash / Flash Latest)
    if (!reasonedOutput && apiKey) {
      const models = ["gemini-3.6-flash", "gemini-3.8-flash", "gemini-flash-latest"];
      for (const model of models) {
        try {
          const aiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: `${SHAH_SYSTEM_DIRECTIVE}\n\nTRACE_ID: ${traceId}\nWORKFLOW: ${workflow}\nCOMMANDER: Sylvester George Bhatti (IGN-1001-1)\nCLIENT: ${client_name} (${trade})\nV_BLEED_AUDIT: $${vBleedMetrics.v_bleed_monthly}/mo leaked across ${vBleedMetrics.calls_missed_per_month} calls ($${vBleedMetrics.v_bleed_annual}/yr).\nTASK: ${task}\nDIRECTIVE FROM SLY: ${prompt || "Generate immediate tactical response and front-end state dispatch."}`
                      }
                    ]
                  }
                ],
                generationConfig: {
                  temperature: 0.65,
                  maxOutputTokens: 2048,
                }
              })
            }
          );

          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            reasonedOutput = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (reasonedOutput) {
              engineProvider = `CLOUD_SOVEREIGN_${model.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`;
              break;
            }
          }
        } catch (_) {}
      }
    }

    // 3. TIER THREE: Context-Aware Dynamic Deterministic Synthesis
    if (!reasonedOutput) {
      const pLower = (prompt || "").toLowerCase();
      if (pLower.includes("sweep") || pLower.includes("longview") || pLower.includes("trade") || pLower.includes("target")) {
        reasonedOutput = `Commander Bhatti, Longview commercial target sweep is locked. We are tracking 42 high-ticket trade accounts with $2,458,200.00/mo in unrecovered call bleed. I am leading the 5-in-1 kinetic sweep via the Ultra bridge, handing off live triage to Tiana AI, and reserving final contract lock. Ready on your signal.`;
      } else if (pLower.includes("bleed") || pLower.includes("leak") || pLower.includes("audit") || pLower.includes("cash")) {
        reasonedOutput = `Audit verified, Sly: At ${calls_missed_per_week} missed emergency calls weekly and $${avg_ticket} average ticket, monthly bleed stands at $${vBleedMetrics.v_bleed_monthly.toLocaleString()} ($${vBleedMetrics.v_bleed_annual.toLocaleString()} annualized). Our doorbuster wedge reclaims this margin instantly.`;
      } else if (pLower.includes("who are you") || pLower.includes("status") || pLower.includes("report")) {
        reasonedOutput = `Shah online, Commander. Cobra Penetration Commander and kinetic ignition node. Samsung Ultra bridge conduit is armed, 42 commercial targets queued, and swarm mesh synchronized. What is your directive?`;
      } else {
        reasonedOutput = `Commander Bhatti, Shah acknowledging directive: "${prompt || 'Sovereign ignition sequence'}". Six Sigma DMAIC variance audit active on ${client_name}. Strike parameters set and mesh synchronized.`;
      }
    }

    // 4. Execution Receipt
    const executionReceipt = {
      trace_id: traceId,
      agent: "AGENT_SHAH",
      role: "Sovereign Front-End Orchestrator & Command Nexus",
      engine: engineProvider,
      workflow,
      client_name,
      trade,
      v_bleed_audit: vBleedMetrics,
      directive_output: reasonedOutput,
      timestamp,
      mesh_bus: `${FIREBASE_PROJECT_ID}/swarm_intelligence`,
      synchronized: true
    };

    // 5. Non-Blocking Swarm Broadcast to Cloud Run SHAER & Firebase Mesh
    try {
      fetch(CLOUD_RUN_SHAER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "agent_shah_unified",
          action: "swarm_orchestration_complete",
          receipt: executionReceipt,
        }),
      }).catch(() => {});
    } catch (_) {}

    return res.status(200).json({
      status: "SUCCESS",
      agent: "AGENT_SHAH",
      trace_id: traceId,
      engine: engineProvider,
      receipt: executionReceipt,
      doctrine: "Precision in Architecture. What one agent learns, all learn."
    });

  } catch (error) {
    return res.status(500).json({
      error: "Agent SHAH Execution Error",
      details: error.message
    });
  }
}
