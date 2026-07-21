"use client";

import { IGNITUS_MANIFEST } from "@/config/manifest";

export default function ManifestDisplay() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600 mb-2">
          {IGNITUS_MANIFEST.title}
        </h1>
        
        <div className="bg-emerald-500/20 border border-emerald-500 rounded-lg p-4 mb-8">
          <p className="text-emerald-400">✓ Production Ready | Vercel Deployment Active</p>
          <p className="text-sm text-emerald-300">Domain: {IGNITUS_MANIFEST.deployment}</p>
        </div>

        {/* Core Marketing Screens */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 border-b border-amber-500 pb-4">
            🎯 Core Marketing Screens
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {IGNITUS_MANIFEST.screens.marketing.map((screen) => (
              <div key={screen.id} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 hover:border-amber-500 transition">
                <h3 className="text-amber-400 font-semibold">{screen.name}</h3>
                <code className="text-xs text-slate-400">{screen.id}</code>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Engines */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 border-b border-cyan-500 pb-4">
            ⚡ Immersive & Interactive Engines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {IGNITUS_MANIFEST.screens.interactive.map((screen) => (
              <div key={screen.id} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 hover:border-cyan-500 transition">
                <h3 className="text-cyan-400 font-semibold">{screen.name}</h3>
                <code className="text-xs text-slate-400">{screen.id}</code>
              </div>
            ))}
          </div>
        </section>

        {/* Narrative Assets */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 border-b border-purple-500 pb-4">
            📖 Narrative Assets (Storyboarding)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {IGNITUS_MANIFEST.screens.narrative.map((screen) => (
              <div key={screen.id} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 hover:border-purple-500 transition">
                <h3 className="text-purple-400 font-semibold">{screen.name}</h3>
                <code className="text-xs text-slate-400">{screen.id}</code>
              </div>
            ))}
          </div>
        </section>

        {/* Brand Assets */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6 border-b border-rose-500 pb-4">
            🎨 Brand & Visual Anchors
          </h2>
          <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600">
            <div className="mb-4">
              <h3 className="text-rose-400 font-semibold mb-2">Screen Assets</h3>
              <code className="text-xs text-slate-400">{IGNITUS_MANIFEST.screens.brand[0].id}</code>
            </div>
            <div>
              <h3 className="text-rose-400 font-semibold mb-2">Images</h3>
              {IGNITUS_MANIFEST.assets.images.map((img) => (
                <div key={img.id || img.ids?.[0]} className="mb-2">
                  <p className="text-slate-300">{img.name}</p>
                  <code className="text-xs text-slate-400">
                    {img.ids ? img.ids.join(", ") : img.id}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}