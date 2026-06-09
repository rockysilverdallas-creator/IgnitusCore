import Link from "next/link"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Approach", href: "#approach" },
  { label: "Results", href: "#results" },
  { label: "Contact", href: "#contact" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/30">
            <span className="size-2.5 rounded-full bg-primary shadow-[0_0_12px_2px_var(--color-primary)]" />
          </span>
          <span className="text-base font-semibold tracking-tight">
            Ignitus
            <span className="ml-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Marketing
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Button
          nativeButton={false}
          render={<a href="#contact">Start a project</a>}
          size="sm"
          className="font-medium"
        />
      </div>
    </header>
  )
}
