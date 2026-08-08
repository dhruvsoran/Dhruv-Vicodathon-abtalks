"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme";
import { usePersona } from "@/components/persona-store";

const sections = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#curriculum", label: "Curriculum" },
  { href: "/#shields", label: "Streak Shields" },
  { href: "/#faq", label: "FAQ" },
];

function NavBar() {
  const [open, setOpen] = useState(false);
  const { persona } = usePersona();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-line glass-strong">
      <div className="shell flex h-14 items-center justify-between gap-3">
        <Link href="/" aria-label="ABTalks home" className="tap focusring rounded-lg">
          <Logo size={28} />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {sections.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="tap focusring rounded-lg px-3 py-2 text-[13.5px] text-muted transition-colors hover:text-fg"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/dashboard"
            className="tap focusring hidden rounded-full border border-line bg-surface px-3.5 py-1.5 text-[12.5px] font-medium text-fg md:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href={`/day/${persona.currentDay}`}
            className="tap focusring hidden rounded-full ember-fill px-3.5 py-1.5 text-[12.5px] font-semibold text-white md:inline-flex"
          >
            Start free
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="tap focusring grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-fg md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
              {open ? (
                <path
                  d="m6 6 12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-ink md:hidden">
          <nav aria-label="Mobile" className="shell py-3">
            <ul className="space-y-0.5">
              {sections.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="tap focusring flex items-center justify-between rounded-xl px-3 py-3 text-[15px] text-fg"
                  >
                    {s.label}
                    <span aria-hidden="true" className="text-faint">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 grid gap-2 border-t border-line pt-3">
              <Link
                href="/dashboard"
                className="tap focusring rounded-xl border border-line bg-surface py-3 text-center text-[14.5px] font-medium"
              >
                Sign in
              </Link>
              <Link
                href="/dashboard"
                className="tap focusring rounded-xl ember-fill py-3 text-center text-[14.5px] font-semibold text-white"
              >
                Start Day 1 free
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default function SiteNav() {
  const pathname = usePathname();
  return <NavBar key={pathname} />;
}
