export default function Home( ) {
  return (
    <main className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col items-center justify-start px-4 md:px-10 py-10 max-w-[1440px] mx-auto font-sans">
      
      {/* 1. TOP STATUS HEADER */}
      <div className="w-full max-w-[1024px] mb-6 flex justify-between items-center border-b border-[#222a3d] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#ceee93] inline-block animate-pulse"></span>
          <span className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#ceee93]">
            SYSTEM ONLINE // EXECUTIVE DEMO
          </span>
        </div>
        <span className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#8f9282]">
          IGNITUS CORE V1.0
        </span>
      </div>

      {/* 2. VIDEO STREAM MODULE */}
      <div className="w-full max-w-[1024px] mb-10 bg-[#171f33] border border-[#222a3d] focus-within:border-[#ceee93] transition-all duration-150">
        <div className="bg-[#131b2e] px-4 py-2 border-b border-[#222a3d] flex justify-between items-center">
          <span className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#c5c8b7]">
            [STREAM_01] EXECUTIVE_PRESENTATION.MP4
          </span>
          <span className="font-mono text-[12px] text-[#8f9282]">1080P // H.264</span>
        </div>

        <div className="relative aspect-video w-full bg-[#060e20]">
          <video 
            controls 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover rounded-none"
          >
            <source src="/Executive_in_blue_suit_202606120303.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* 3. DOWNLOAD RELEASES MODULE (DOWNLOAD BUTTONS) */}
      <div className="w-full max-w-[1024px] mb-10 bg-[#171f33] border border-[#222a3d] p-6">
        <div className="flex items-center justify-between border-b border-[#222a3d] pb-3 mb-6">
          <span className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#ceee93]">
            [SYSTEM_DEPLOYMENT] CLIENT_BUILD_RELEASES
          </span>
          <span className="font-mono text-[12px] text-[#8f9282]">V1.0.4 // STABLE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Android Download Button */}
          <a 
            href="/downloads/ignitus-core-v1.apk" 
            download
            className="bg-[#131b2e] border border-[#222a3d] hover:border-[#ceee93] p-4 text-center group transition-colors block"
          >
            <p className="font-mono text-[12px] text-[#c5c8b7] mb-1">ANDROID OS</p>
            <p className="font-semibold text-white group-hover:text-[#ceee93]">Download APK</p>
          </a>

          {/* Windows Download Button */}
          <a 
            href="/downloads/ignitus-core-v1.exe" 
            download
            className="bg-[#131b2e] border border-[#222a3d] hover:border-[#ceee93] p-4 text-center group transition-colors block"
          >
            <p className="font-mono text-[12px] text-[#c5c8b7] mb-1">WINDOWS x64</p>
            <p className="font-semibold text-white group-hover:text-[#ceee93]">Download EXE</p>
          </a>

          {/* macOS Download Button */}
          <a 
            href="/downloads/ignitus-core-v1.dmg" 
            download
            className="bg-[#131b2e] border border-[#222a3d] hover:border-[#ceee93] p-4 text-center group transition-colors block"
          >
            <p className="font-mono text-[12px] text-[#c5c8b7] mb-1">MACOS SILICON</p>
            <p className="font-semibold text-white group-hover:text-[#ceee93]">Download DMG</p>
          </a>
        </div>
      </div>

      {/* 4. SYSTEM ARCHITECTURE MATRIX */}
      <div className="w-full max-w-[1024px] bg-[#171f33] border border-[#222a3d] p-6">
        <div className="flex items-center justify-between border-b border-[#222a3d] pb-3 mb-6">
          <span className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#ceee93]">
            [CORE_INFRASTRUCTURE] ARCHITECTURE_MATRIX
          </span>
          <span className="font-mono text-[12px] text-[#8f9282]">VERCEL // GCP // BIGQUERY</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[12px]">
          <div className="bg-[#131b2e] p-4 border border-[#222a3d]">
            <p className="text-[#ceee93] mb-2">// INGESTION & PIPELINE</p>
            <p className="text-[#c5c8b7]">Framework: Next.js App Router</p>
            <p className="text-[#c5c8b7]">Deployment: Vercel Edge Network</p>
            <p className="text-[#c5c8b7]">CDN: Fast Origin Transfer</p>
          </div>
          <div className="bg-[#131b2e] p-4 border border-[#222a3d]">
            <p className="text-[#ceee93] mb-2">// DATA & ANALYTICS</p>
            <p className="text-[#c5c8b7]">Warehouse: Google BigQuery</p>
            <p className="text-[#c5c8b7]">Compute: Vertex AI Workflow</p>
            <p className="text-[#c5c8b7]">Telematics: Custom Event Tracking</p>
          </div>
        </div>
      </div>

    </main>
  );
}
