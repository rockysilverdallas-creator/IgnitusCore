import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Pillars } from "@/components/pillars"
import { Approach } from "@/components/approach"
import { Results } from "@/components/results"
import { Calculator } from "@/components/calculator"
import { ContactCta } from "@/components/contact-cta"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Pillars />
        <Approach />
        <Results />
        <Calculator />

        {/* US DIRECT OUTBOUND & DISPATCH PIPELINE */}
        <section className="flex justify-center px-6 py-10">
          <div className="w-full max-w-[1024px] bg-[#171f33] border border-[#222a3d] p-6">
            <div className="flex items-center justify-between border-b border-[#222a3d] pb-3 mb-6">
              <span className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#ceee93]">
                [OUTBOUND_PIPELINE] US_DIRECT_DISPATCH
              </span>
              <span className="font-mono text-[12px] text-[#8f9282]">ACTIVE // SECURE_ORIGIN</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <a
                href="tel:+13185550199"
                className="bg-[#131b2e] border border-[#222a3d] hover:border-[#ceee93] p-4 text-center group transition-colors block"
              >
                <p className="font-mono text-[10px] uppercase text-[#c5c8b7] mb-1">VOICE DISPATCH</p>
                <p className="font-semibold text-white text-sm group-hover:text-[#ceee93]">Call Direct</p>
              </a>
              <a
                href="sms:+13185550199?body=Ignitus%20Core%20Inquiry"
                className="bg-[#131b2e] border border-[#222a3d] hover:border-[#ceee93] p-4 text-center group transition-colors block"
              >
                <p className="font-mono text-[10px] uppercase text-[#c5c8b7] mb-1">TEXT DISPATCH</p>
                <p className="font-semibold text-white text-sm group-hover:text-[#ceee93]">SMS / MMS</p>
              </a>
              <a
                href="mailto:contact@ignituscore.com?subject=Ignitus%20Core%20Executive%20Inquiry"
                className="bg-[#131b2e] border border-[#222a3d] hover:border-[#ceee93] p-4 text-center group transition-colors block"
              >
                <p className="font-mono text-[10px] uppercase text-[#c5c8b7] mb-1">EXECUTIVE MAIL</p>
                <p className="font-semibold text-white text-sm group-hover:text-[#ceee93]">Send Email</p>
              </a>
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
        </section>

        <ContactCta />
      </main>
      <SiteFooter />
    </div>
  )
}
