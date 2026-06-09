const results = [
  {
    metric: "100%",
    metricLabel: "Data Clarity",
    quote:
      "Ignitus builds transparent data layers. We make sure businesses go from guessing to a predictable, visible pipeline.",
  },
  {
    metric: "Zero",
    metricLabel: "Guesswork",
    quote:
      "Our strategic model isn't a buzzword — it's built to ensure every dollar spent is completely accounted for.",
  },
  {
    metric: "Connected",
    metricLabel: "Infrastructure",
    quote:
      "We establish a single, unified view of performance, connecting your marketing metrics directly to secure cloud systems.",
  },
]

export function Results() {
  return (
    <section id="results" className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Proven results
        </p>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Outcomes that speak for themselves
        </h2>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {results.map((r) => (
          <figure
            key={r.metricLabel}
            className="flex flex-col rounded-2xl border border-border bg-card p-7"
          >
            <div className="text-3xl font-semibold tracking-tight text-primary">
              {r.metric}
            </div>
            <div className="mt-1 text-sm font-medium uppercase tracking-wide text-foreground">
              {r.metricLabel}
            </div>
            <blockquote className="mt-5 text-sm leading-relaxed text-foreground/90">
              {`"${r.quote}"`}
            </blockquote>
          </figure>
        ))}
      </div>
    </section>
  )
}
