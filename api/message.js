// Vercel Serverless Function: MCP Message Receiver for Ignitus Core & Agent SHAER / SHAH
// Handles incoming client commands and JSON-RPC messages from MCP clients
// Route: /api/message

import { transports } from "./sse.js";

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST for MCP messages." });
  }

  const sessionId = req.query.sessionId;

  if (!sessionId || !transports.has(sessionId)) {
    return res.status(404).json({
      error: "Session not found or expired",
      detail: "The SSE transport session could not be located in memory. Ensure client maintains active SSE connection to /api/sse.",
    });
  }

  try {
    const transport = transports.get(sessionId);
    await transport.handlePostMessage(req, res, req.body);
  } catch (err) {
    console.error("[MCP Message Handler Error]:", err);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Failed to process MCP message", details: err.message });
    }
  }
}
