// Bulletproof Operational Health Check Script
// Executes complete end-to-end verification of all Ignitus Core cognitive endpoints

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

async function runAudit() {
  console.log("=================================================");
  console.log("IGNITUS CORE PRE-FLIGHT COGNITIVE MESH AUDIT");
  console.log("=================================================");

  const results = [];

  // 1. Test Tiana Web API
  try {
    const tianaModule = await import("../api/tiana.js");
    let tianaReply = "";
    const mockRes = {
      setHeader: () => {},
      status: (code) => ({
        json: (data) => {
          tianaReply = data.reply || "";
          results.push({ name: "TIANA_WEB_API", code, reply: tianaReply.substring(0, 80) + "..." });
        }
      })
    };
    await tianaModule.default({ method: "POST", body: { message: "Test HVAC emergency call triage.", name: "Client Audit", trade: "HVAC" } }, mockRes);
  } catch (err) {
    results.push({ name: "TIANA_WEB_API", code: 500, error: err.message });
  }

  // 2. Test Spark Gemma API
  try {
    const sparkModule = await import("../api/spark_gemma.js");
    let sparkOutput = "";
    let provider = "";
    const mockRes = {
      setHeader: () => {},
      status: (code) => ({
        json: (data) => {
          sparkOutput = data.receipt?.output || "";
          provider = data.provider || "";
          results.push({ name: "SPARK_GEMMA_API", code, provider, output: sparkOutput.substring(0, 80) + "..." });
        }
      })
    };
    await sparkModule.default({ method: "POST", body: { workflow: "BULLDOZER", prompt: "Test engine audit.", task: "AUDIT" } }, mockRes);
  } catch (err) {
    results.push({ name: "SPARK_GEMMA_API", code: 500, error: err.message });
  }

  // 3. Test Agent SHAH API
  try {
    const shahModule = await import("../api/shah.js");
    let shahProvider = "";
    const mockRes = {
      setHeader: () => {},
      status: (code) => ({
        json: (data) => {
          shahProvider = data.engine_provider || "";
          results.push({ name: "AGENT_SHAH_API", code, provider: shahProvider, reply: (data.tiana_directive || "").substring(0, 80) + "..." });
        }
      })
    };
    await shahModule.default({ method: "POST", body: { workflow: "AUDIT", prompt: "Audit posture", client_name: "Audit Test" } }, mockRes);
  } catch (err) {
    results.push({ name: "AGENT_SHAH_API", code: 500, error: err.message });
  }

  // 4. Test Twilio Voice Line API
  try {
    const voiceModule = await import("../api/twilio/voice.js");
    let twimlText = "";
    const mockRes = {
      setHeader: () => {},
      status: (code) => ({
        send: (twiml) => {
          twimlText = twiml || "";
          results.push({ name: "TWILIO_VOICE_API", code, twimlLength: twimlText.length, hasSay: twimlText.includes("<Say>") });
        }
      })
    };
    await voiceModule.default({ method: "POST", body: { SpeechResult: "My rooftop HVAC compressor is making a screeching noise and overheating." } }, mockRes);
  } catch (err) {
    results.push({ name: "TWILIO_VOICE_API", code: 500, error: err.message });
  }

  console.log(JSON.stringify(results, null, 2));
  console.log("=================================================");
  const allPassed = results.every(r => r.code === 200 && !r.error);
  if (allPassed) {
    console.log("SUCCESS: ALL COGNITIVE ENDPOINTS VERIFIED 100% OPERATIONAL.");
  } else {
    console.error("WARNING: FEW ENDPOINTS RETURNED NON-200 CODES.");
    process.exit(1);
  }
}

runAudit();
