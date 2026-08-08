"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GridIcon, HomeIcon, TrophyIcon, UserIcon } from "@/components/icons";
import { usePersona } from "@/components/persona-store";

export default function TabBar() {
  const pathname = usePathname();
  const { persona } = usePersona();

  const items = [
    { href: "/dashboard", label: "Home", icon: HomeIcon, match: (p: string) => p === "/dashboard" },
    {
      href: `/day/${persona.currentDay}`,
      label: "Today",
      icon: GridIcon,
      match: (p: string) => p.startsWith("/day"),
    },
    { href: "/dashboard#standing", label: "Rank", icon: TrophyIcon, match: () => false },
    { href: "/dashboard#profile", label: "Profile", icon: UserIcon, match: () => false },
  ];

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line glass-strong pb-[max(6px,env(safe-area-inset-bottom))] md:hidden"
    >
      <ul className="mx-auto flex max-w-[480px]">
        {items.map((it) => {
          const active = it.match(pathname);
          const Icon = it.icon;
          return (
            <li key={it.label} className="flex-1">
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={`tap focusring flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium ${
                  active ? "text-ember" : "text-faint"
                }`}
              >
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
