{/* 5. US DIRECT OUTBOUND & DISPATCH PIPELINE */}
<div className="w-full max-w-[1024px] mt-10 bg-[#171f33] border border-[#222a3d] p-6">
  <div className="flex items-center justify-between border-b border-[#222a3d] pb-3 mb-6">
    <span className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#ceee93]">
      [OUTBOUND_PIPELINE] US_DIRECT_DISPATCH
    </span>
    <span className="font-mono text-[12px] text-[#8f9282]">ACTIVE // SECURE_ORIGIN</span>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    {/* Voice Route */}
    <a 
      href="tel:+13185550199" 
      className="bg-[#131b2e] border border-[#222a3d] hover:border-[#ceee93] p-4 text-center group transition-colors block"
    >
      <p className="font-mono text-[10px] uppercase text-[#c5c8b7] mb-1">VOICE DISPATCH</p>
      <p className="font-semibold text-white text-sm group-hover:text-[#ceee93]">Call Direct</p>
    </a>

    {/* SMS / MMS Route */}
    <a 
      href="sms:+13185550199?body=Ignitus%20Core%20Inquiry" 
      className="bg-[#131b2e] border border-[#222a3d] hover:border-[#ceee93] p-4 text-center group transition-colors block"
    >
      <p className="font-mono text-[10px] uppercase text-[#c5c8b7] mb-1">TEXT DISPATCH</p>
      <p className="font-semibold text-white text-sm group-hover:text-[#ceee93]">SMS / MMS</p>
    </a>

    {/* Email Route */}
    <a 
      href="mailto:contact@ignituscore.com?subject=Ignitus%20Core%20Executive%20Inquiry" 
      className="bg-[#131b2e] border border-[#222a3d] hover:border-[#ceee93] p-4 text-center group transition-colors block"
    >
      <p className="font-mono text-[10px] uppercase text-[#c5c8b7] mb-1">EXECUTIVE MAIL</p>
      <p className="font-semibold text-white text-sm group-hover:text-[#ceee93]">Send Email</p>
    </a>

    {/* Social Handle Route */}
    <a 
      href="https://x.com/ignituscore" 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-[#131b2e] border border-[#222a3d] hover:border-[#ceee93] p-4 text-center group transition-colors block"
    >
      <p className="font-mono text-[10px] uppercase text-[#c5c8b7] mb-1">OFFICIAL HANDLE</p>
      <p className="font-semibold text-white text-sm group-hover:text-[#ceee93]">@ignituscore</p>
    </a>
  </div>
</div>
