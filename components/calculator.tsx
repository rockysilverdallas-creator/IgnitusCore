"use client"

import { useState } from "react"

const TERMS = [3, 6, 12, 24]
const MIN = 2500
const MAX = 100000
const STEP = 500

function formatUsd(value: number) {
  return "$" + value.toLocaleString("en-US")
}

export function Calculator() {
  const [projectValue, setProjectValue] = useState(25000)
  const [term, setTerm] = useState(6)

  const monthly = Math.round(projectValue / term)
  const pct = ((projectValue - MIN) / (MAX - MIN)) * 100

  return (
    <section id="calculator" className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Project financing
        </p>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Estimate your monthly investment
        </h2>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          Choose a project value and a payment term to see a transparent
          monthly estimate. No guesswork, just clear numbers.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-border bg-card p-7 md:p-10">
        <div className="flex items-baseline justify-between">
          <label
            htmlFor="projectValue"
            className="text-sm font-medium uppercase tracking-wide text-muted-foreground"
          >
            Project value
          </label>
          <span className="text-2xl font-semibold tracking-tight text-primary">
            {formatUsd(projectValue)}
          </span>
        </div>

        <input
          id="projectValue"
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          value={projectValue}
          onChange={(e) => setProjectValue(Number(e.target.value))}
          aria-label="Project value"
          className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full outline-none [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
          style={{
            background: `linear-gradient(to right, var(--primary) ${pct}%, var(--muted) ${pct}%)`,
          }}
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{formatUsd(MIN)}</span>
          <span>{formatUsd(MAX)}</span>
        </div>

        <div className="mt-8">
          <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Payment term
          </span>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TERMS.map((months) => {
              const active = months === term
              return (
                <button
                  key={months}
                  type="button"
                  onClick={() => setTerm(months)}
                  aria-pressed={active}
                  className={
                    "rounded-lg border px-4 py-3 text-sm font-medium transition-colors " +
                    (active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-primary/40")
                  }
                >
                  {months} mo
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-border bg-background p-6 sm:flex-row">
          <div className="text-sm uppercase tracking-wide text-muted-foreground">
            Estimated monthly payment
          </div>
          <div className="text-4xl font-semibold tracking-tight text-primary">
            {formatUsd(monthly)}
            <span className="ml-1 text-base font-normal text-muted-foreground">
              /mo
            </span>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Estimates only. Final terms are confirmed during your strategy call.
        </p>
      </div>
    </section>
  )
}
