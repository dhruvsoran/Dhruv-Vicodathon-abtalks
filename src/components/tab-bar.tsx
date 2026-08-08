"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GridIcon, HomeIcon, TrophyIcon, UserIcon } from "@/components/icons";
import { usePersona } from "@/components/persona-store";

type TabId = "home" | "today" | "rank" | "profile";

/**
 * Bottom tab bar.
 *
 * Rank and Profile are in-page anchors on `/dashboard`, so `usePathname()`
 * alone cannot distinguish them — it ignores the hash, which meant tapping
 * Rank left Home highlighted as if you had navigated back.
 *
 * Active state is therefore resolved by **where the user actually is**: a
 * scroll-spy observes the anchored sections and highlights whichever one
 * occupies the viewport. That also keeps the bar correct when the user
 * scrolls manually rather than tapping.
 */
export default function TabBar() {
  const pathname = usePathname();
  const { persona } = usePersona();
  const [section, setSection] = useState<TabId>("home");

  const onDashboard = pathname === "/dashboard";

  useEffect(() => {
    if (!onDashboard) return;

    const targets = [
      { id: "profile" as const, el: document.getElementById("profile") },
      { id: "standing" as const, el: document.getElementById("standing") },
    ].filter((t): t is { id: "profile" | "standing"; el: HTMLElement } => Boolean(t.el));

    if (!targets.length) return;

    const visible = new Map<string, number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        }
        // Profile sits below Rank, so prefer it when both are on screen.
        const profile = visible.get("profile") ?? 0;
        const standing = visible.get("standing") ?? 0;
        if (profile > 0.35) setSection("profile");
        else if (standing > 0.35) setSection("rank");
        else setSection("home");
      },
      { threshold: [0, 0.35, 0.6, 1] },
    );

    targets.forEach((t) => io.observe(t.el));
    return () => io.disconnect();
  }, [onDashboard]);

  const active: TabId = !onDashboard
    ? pathname.startsWith("/day")
      ? "today"
      : "home"
    : section;

  const items: { id: TabId; href: string; label: string; icon: typeof HomeIcon }[] = [
    { id: "home", href: "/dashboard", label: "Home", icon: HomeIcon },
    { id: "today", href: `/day/${persona.currentDay}`, label: "Today", icon: GridIcon },
    { id: "rank", href: "/dashboard#standing", label: "Rank", icon: TrophyIcon },
    { id: "profile", href: "/dashboard#profile", label: "Profile", icon: UserIcon },
  ];

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line glass-strong pb-[max(6px,env(safe-area-inset-bottom))] md:hidden"
    >
      <ul className="mx-auto flex max-w-[480px]">
        {items.map((it) => {
          const isActive = it.id === active;
          const Icon = it.icon;
          return (
            <li key={it.id} className="flex-1">
              <Link
                href={it.href}
                aria-current={isActive ? "page" : undefined}
                className={`tap focusring relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors duration-200 ${
                  isActive ? "text-ember" : "text-faint"
                }`}
              >
                {/* Active indicator sits on the top edge of the bar. */}
                <span
                  aria-hidden="true"
                  className={`absolute -top-px h-0.5 w-8 rounded-full transition-all duration-300 ${
                    isActive ? "ember-fill opacity-100" : "opacity-0"
                  }`}
                />
                <Icon className="h-[19px] w-[19px]" />
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
