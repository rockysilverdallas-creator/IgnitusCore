// import ManifestDisplay from "@/components/ManifestDisplay";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col items-center justify-start px-4 md:px-10 py-10 max-w-[1440px] mx-auto font-sans">
      
      {/* Top Status Header */}
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

      {/* Video Container Module */}
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

      {/* Manifest Display (Temporarily Disabled) */}
      {/* <div className="w-full max-w-[1024px] bg-[#171f33] border border-[#222a3d]">
        <ManifestDisplay />
      </div> */}

    </main>
  );
}
