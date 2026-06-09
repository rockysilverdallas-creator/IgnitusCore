import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* subtle ember glow accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]"
      />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-24 pt-20 text-center md:pt-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_2px_var(--color-primary)]" />
          Performance marketing, engineered for momentum
        </span>

        <h1 className="mt-8 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          We turn cold audiences into{" "}
          <span className="bg-gradient-to-r from-primary to-amber-300 bg-clip-text text-transparent">
            ignited demand
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          Ignitus Marketing is built on three pillars — Activation, Ignition,
          and Nexus. We spark attention, accelerate intent, and connect your
          business to measurable growth.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            size="lg"
            className="group font-medium"
            nativeButton={false}
            render={
              <a href="#contact">
                Start a project
                <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            }
          />
          <Button
            size="lg"
            variant="outline"
            className="font-medium"
            nativeButton={false}
            render={<a href="#approach">See how we work</a>}
          />
        </div>

        <div className="mt-16 grid w-full max-w-2xl grid-cols-3 gap-6 border-t border-border/60 pt-8">
          {[
            { value: "3.4x", label: "Avg. return on ad spend" },
            { value: "120+", label: "Businesses activated" },
            { value: "94%", label: "Client retention" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-2xl font-semibold tracking-tight md:text-3xl">
                {stat.value}
              </span>
              <span className="text-xs leading-snug text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
