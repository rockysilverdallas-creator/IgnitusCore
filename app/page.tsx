import ManifestDisplay from "@/components/ManifestDisplay";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start px-4 py-12 md:py-20">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 -z-10 pointer-events-none" />

      {/* Video Container with Glow Effect */}
      <div className="relative w-full max-w-5xl mb-12 group">
        {/* Ambient Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

        {/* Video Wrapper */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-sm aspect-video">
          <video 
            controls 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/Executive_in_blue_suit_202606120303.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Manifest Display Component */}
      <div className="w-full max-w-5xl">
        <ManifestDisplay />
      </div>
    </main>
  );
}
