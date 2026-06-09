import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function ContactCta() {
  return (
    <section id="contact" className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-16 text-center md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
        />
        <div className="relative mx-auto max-w-xl">
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Ready to ignite your growth?
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Book a strategy session and we&apos;ll map the fastest path from
            where you are to where you want to be.
          </p>

          <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="email" className="sr-only">
              Work email
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@company.com"
              className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            <Button type="submit" size="lg" className="group shrink-0 font-medium">
              Get started
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">
            No spam. We&apos;ll respond within one business day.
          </p>
        </div>
      </div>
    </section>
  )
}
