import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Pillars } from "@/components/pillars"
import { Approach } from "@/components/approach"
import { Results } from "@/components/results"
import { Calculator } from "@/components/calculator"
import { ContactCta } from "@/components/contact-cta"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <Hero />
        <Pillars />
        <Approach />
        <Results />
        <Calculator />
        <ContactCta />
      </main>
      <SiteFooter />
    </div>
  )
}
