const steps = [
  {
    step: "01",
    title: "Discover",
    desc: "We audit your market, audience, and current performance to find the highest-leverage opportunities.",
  },
  {
    step: "02",
    title: "Build",
    desc: "We design the creative, messaging, and media architecture that maps to each stage of intent.",
  },
  {
    step: "03",
    title: "Launch",
    desc: "We deploy campaigns across channels with clear KPIs and real-time instrumentation.",
  },
  {
    step: "04",
    title: "Scale",
    desc: "We double down on what works, cut what doesn't, and compound results month over month.",
  },
]

export function Approach() {
  return (
    <section
      id="approach"
      className="border-y border-border/60 bg-card/40"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div className="md:sticky md:top-24 md:self-start">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              The approach
            </p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              A clear path from spark to scale
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              No black boxes. Every step is transparent, measurable, and built
              to compound. You always know what we&apos;re doing and why.
            </p>
          </div>

          <div className="flex flex-col">
            {steps.map((s, i) => (
              <div
                key={s.step}
                className={`flex gap-6 py-7 ${
                  i !== steps.length - 1 ? "border-b border-border/60" : ""
                }`}
              >
                <span className="font-mono text-sm font-medium text-primary">
                  {s.step}
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
