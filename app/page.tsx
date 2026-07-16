export default function IgnitusDashboard() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] font-sans antialiased p-4 md:p-8 selection:bg-red-500/30">
      
      {/* Header Matrix */}
      <header className="max-w-6xl mx-auto mb-12 border-b border-slate-800 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            IGNITUS NEXUS
          </h1>
          <p className="text-xs tracking-widest uppercase text-slate-500 mt-1">
            Commercial Outcome & Valueline Architecture // June 14, 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">VALUELINE MODEL ACTIVE</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto space-y-12">
        
        {/* Core Transformation Narrative */}
        <section className="bg-slate-950 border border-slate-900 rounded-xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-red-500 to-blue-600" />
          <h2 className="text-xl font-bold tracking-tight mb-4 text-slate-200">The Call to Adventure: Escaping the Volatility Trap</h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-4xl">
            Every local business owner faces a defining challenge: the relentless pressure for immediate revenue clashes with the necessity of building a sustainable, predictable business. Traditional methods burn capital on generic "interest." Ignitus intercepts **Purchase Intent**. We reject slow calendar-day horizons and deploy a non-linear Valueline focused strictly on execution speed, cash-flow velocity, and permanent operational authority.
          </p>
        </section>

        {/* The 3-Phase Journey Framework */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
            <div className="text-xs font-mono text-slate-500 mb-2">PHASE 01 // INTELLIGENCE</div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">Insight</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Geospatial scraping and data alignment. We map the exact digital clusters of high-intent customers within your specific operational radius.
            </p>
          </div>
          <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6 relative">
            <div className="absolute top-0 right-0 px-2 py-0.5 text-[9px] bg-red-950 text-red-400 border-l border-b border-red-900 font-mono">KINETIC</div>
            <div className="text-xs font-mono text-slate-500 mb-2">PHASE 02 // VELOCITY</div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">Activation</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              High-speed deployment. Integrating directly with major ad infrastructure to target immediate buyer behaviors and spike transactional velocity.
            </p>
          </div>
          <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
            <div className="text-xs font-mono text-slate-500 mb-2">PHASE 03 // AUTOPILOT</div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">Nexus</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              The continuous feedback loop. Self-optimizing engine instances that permanently capture demand and scale down customer acquisition costs.
            </p>
          </div>
        </section>

        {/* The Dynamic Valueline Milestones Matrix */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold uppercase tracking-wider text-slate-400">The Ignitus Valueline</h2>
          <div className="overflow-x-auto border border-slate-800 rounded-lg bg-slate-900/20">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 font-mono text-xs uppercase tracking-wider text-slate-400">
                  <th className="p-4">Valueline Node</th>
                  <th className="p-4">Operational Status</th>
                  <th className="p-4">Commercial Consequence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="p-4 font-mono text-xs text-red-400 font-bold">NODE I: INTENT CAPTURE</td>
                  <td className="p-4">Scraping & Active API webhooks trigger.</td>
                  <td className="p-4">Immediate identification of active buyer signals, skipping generic browsing traffic entirely.</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-xs text-blue-400 font-bold">NODE II: TRANSACTION MATRIX</td>
                  <td className="p-4">Next.js frontends & LangChain router agents deploy.</td>
                  <td className="p-4">Drastic reduction in lead friction. Converts intent signals straight into calls, bookings, and cash flow.</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-xs text-emerald-400 font-bold">NODE III: SOVEREIGN AUTOPILOT</td>
                  <td className="p-4">Vertex AI & BigQuery analytical feedback loops lock down.</td>
                  <td className="p-4">Customer acquisition costs systematically collapse. You own a self-optimizing system instead of renting ad campaigns.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Value Investment Tier Stack */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold uppercase tracking-wider text-slate-400">Value-Driven Pricing Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-6 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-slate-500 uppercase">Phase 1</div>
                <h3 className="text-xl font-bold text-white mt-1">Insight Architecture</h3>
                <p className="text-slate-400 text-xs mt-3 leading-relaxed">
                  Deep Discovery & Strategic Mapping. Delivers a verified Local Market Exploitation Map isolating immediate high-intent pockets.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 text-sm font-mono text-slate-300">
                Investment: <span className="text-white font-bold">Fixed Fee</span>
              </div>
            </div>

            <div className="border border-red-900 bg-slate-900/60 rounded-lg p-6 flex flex-col justify-between relative shadow-lg shadow-red-950/20">
              <div className="absolute -top-3 left-6 px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold tracking-widest uppercase">
                Velocity Inbound
              </div>
              <div>
                <div className="text-xs font-mono text-red-400 uppercase">Phase 2</div>
                <h3 className="text-xl font-bold text-white mt-1">Activation Engine</h3>
                <p className="text-slate-300 text-xs mt-3 leading-relaxed">
                  High-Velocity Campaign Deployment. Engineered for immediate, measurable spikes in local transactional cash flow and direct ROI confirmation.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 text-sm font-mono text-red-400">
                Investment: <span className="text-white font-bold">% of Ad Spend + Bonus</span>
              </div>
            </div>

            <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-6 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-slate-500 uppercase">Phase 3</div>
                <h3 className="text-xl font-bold text-white mt-1">Nexus Integration</h3>
                <p className="text-slate-400 text-xs mt-3 leading-relaxed">
                  Continuous Systems Optimization. A self-contained, sovereign digital growth ecosystem that automates workflows and drives long-term equity.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 text-sm font-mono text-slate-300">
                Investment: <span className="text-white font-bold Recurring">Tiered Subscription</span>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Alignment Banner */}
        <footer className="bg-slate-900/20 border border-slate-800/80 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-sm font-bold uppercase text-slate-300 tracking-wider">The Ignitus Promise // Lead Systems Architect</h4>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Engineered by Sylvester Bhatti. Synchronizing deep backend operational design directly with frontend commercial currency to liberate local enterprises from the macro volatility trap.
            </p>
          </div>
          <span className="px-3 py-1 bg-slate-800 rounded text-xs font-mono tracking-wider text-slate-300 shrink-0">
            v2.0.Valueline
          </span>
        </footer>

      </main>
    </div>
  )
}
