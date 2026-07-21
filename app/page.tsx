import ManifestDisplay from "@/components/ManifestDisplay";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl mb-8 overflow-hidden rounded-xl shadow-2xl">
        <video 
          controls 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-auto"
        >
          <source src="/Executive_in_blue_suit_202606120303.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <ManifestDisplay />
    </main>
  );
}
