"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "dark" | "light";
const KEY = "abtalks.theme";
const listeners = new Set<() => void>();

export const themeScript = `(function(){var e=document.documentElement;e.classList.add("js");try{var t=localStorage.getItem("${KEY}");if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}e.setAttribute("data-theme",t);e.style.colorScheme=t}catch(n){e.setAttribute("data-theme","dark")}})();`;

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function getTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark" as Theme);

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", next === "light" ? "#fbfaf9" : "#08080a");
    listeners.forEach((fn) => fn());
  }, []);

  const toggle = useCallback(() => setTheme(getTheme() === "light" ? "dark" : "light"), [setTheme]);

  return { theme, setTheme, toggle };
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isLight}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      title={`Switch to ${isLight ? "dark" : "light"} mode`}
      className={`tap focusring relative grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-muted transition-colors hover:text-fg ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" aria-hidden="true" fill="none">
        {isLight ? (
          <path
            d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.5 8.5 0 1 0 20 14.2Z"
            fill="currentColor"
          />
        ) : (
          <>
            <circle cx="12" cy="12" r="4.2" fill="currentColor" />
            <path
              d="M12 2.6v2.2M12 19.2v2.2M21.4 12h-2.2M4.8 12H2.6m16.04-6.64-1.56 1.56M6.72 17.28l-1.56 1.56m13.48 0-1.56-1.56M6.72 6.72 5.16 5.16"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    </button>
  );
}
