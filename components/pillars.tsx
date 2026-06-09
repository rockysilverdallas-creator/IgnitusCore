import { Zap, Flame, Network } from "lucide-react"

const pillars = [
  {
    icon: Zap,
    title: "Activation",
    desc: "We identify and reach the audiences that matter, sparking the first moment of attention with precision targeting and sharp, compelling creativity.",
  },
  {
    icon: Flame,
    title: "Ignition",
    desc: "We accelerate intent into action — optimizing funnels, messaging, and media to turn interest into compounding momentum.",
  },
  {
    icon: Network,
    title: "Nexus",
    desc: "We connect every channel, signal, and touchpoint into one system, so growth becomes repeatable and fully measurable.",
  },
]

export function Pillars() {
  return (
    <section id="services" className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Our framework
        </p>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Three pillars, one engine for growth
        </h2>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          Every engagement runs through the Ignitus model — a disciplined
          process designed to make demand predictable.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {pillars.map((pillar) => (
          <div
            key={pillar.title}
            className="group relative rounded-2xl border border-border bg-card p-7 transition-colors hover:border-primary/40"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition-colors group-hover:bg-primary/15">
              <pillar.icon className="size-5 text-primary" />
            </span>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">
              {pillar.title}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              {pillar.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
