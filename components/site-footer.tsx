export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/30">
            <span className="size-2.5 rounded-full bg-primary shadow-[0_0_12px_2px_var(--color-primary)]" />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Ignitus
            <span className="ml-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Marketing
            </span>
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Ignitus Marketing. Activation.
          Ignition. Nexus.
        </p>
      </div>
    </footer>
  )
}
