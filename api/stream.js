// Vercel Serverless Function: Real-Time Mesh Telemetry Stream
// Route: /api/stream
// Emits real-time Server-Sent Events (SSE) for operators and dashboards to monitor live node telemetry and strikes

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("X-Accel-Buffering", "no");

  const clientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  // 1. Initial Connection Handshake
  res.write(`event: handshake\n`);
  res.write(`data: ${JSON.stringify({
    event: "CONNECTED",
    client_id: clientId,
    mesh: "IGNITUS_SOVEREIGN_GRID",
    nodes: ["NODE-ALPHA-ARK", "NODE-BETA-DFW", "NODE-GAMMA-GULF", "NODE-CORE-ZED"],
    timestamp: new Date().toISOString()
  })}\n\n`);

  // 2. Stream Initial Node Snapshot
  res.write(`event: node_snapshot\n`);
  res.write(`data: ${JSON.stringify({
    event: "TELEMETRY_SNAPSHOT",
    active_geographic_nodes: 4,
    status: "GRID_ONLINE",
    v_bleed_aggregate_monitoring: "$922,500/mo",
    master_conduit: "AGENT_SHAH",
    cobra_unit_status: "ARMED_AND_READY"
  })}\n\n`);

  // 3. Heartbeat / Stream Pulse (Simulates live bus monitoring over 45s serverless lifecycle)
  let counter = 0;
  const intervalId = setInterval(() => {
    counter++;
    if (res.writableEnded || res.closed) {
      clearInterval(intervalId);
      return;
    }

    const mockNodes = ["NODE-ALPHA-ARK", "NODE-BETA-DFW", "NODE-GAMMA-GULF"];
    const randomNode = mockNodes[Math.floor(Math.random() * mockNodes.length)];

    res.write(`event: telemetry_pulse\n`);
    res.write(`data: ${JSON.stringify({
      pulse_id: counter,
      node_id: randomNode,
      status: "HEARTBEAT_OK",
      stream_latency_ms: Math.floor(Math.random() * 12) + 6,
      intake_velocity: "< 850ms",
      timestamp: new Date().toISOString()
    })}\n\n`);

    if (counter >= 15) {
      clearInterval(intervalId);
      res.write(`event: stream_refresh\n`);
      res.write(`data: ${JSON.stringify({ message: "Lifecycle refresh requested. Reconnect." })}\n\n`);
      res.end();
    }
  }, 3000);

  req.on("close", () => {
    clearInterval(intervalId);
  });
}
