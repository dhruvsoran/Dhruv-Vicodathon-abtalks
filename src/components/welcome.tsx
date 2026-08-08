"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "@/components/logo";

const KEY = "abtalks.welcomed";
const HOLD = 1500;

/**
 * Animated logo intro.
 *
 * Shown once per session so returning visitors are never gated behind an
 * animation. Purely decorative and `aria-hidden`, sitting above the page
 * while it plays — the underlying content is already rendered beneath, so
 * an automated screenshot or a JS failure never sees a blank page.
 */
/**
 * Decided once per page load and cached at module scope.
 *
 * Without the cache, React's development double-mount would write the
 * session flag on the first mount and then read it back as "already seen"
 * on the remount, so the intro would never actually play.
 */
let decision: boolean | null = null;

function shouldPlay() {
  if (decision !== null) return decision;
  if (typeof window === "undefined") return false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    decision = false;
    return decision;
  }
  try {
    decision = sessionStorage.getItem(KEY) !== "1";
  } catch {
    decision = false;
  }
  return decision;
}

export default function Welcome() {
  const [phase, setPhase] = useState<"idle" | "playing" | "leaving" | "done">("idle");

  useEffect(() => {
    if (!shouldPlay()) {
      const skip = window.setTimeout(() => setPhase("done"), 0);
      return () => clearTimeout(skip);
    }

    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}

    // Deliberately no scroll lock: mutating body overflow can shift layout
    // and risks leaving the page unscrollable if anything interrupts the
    // sequence. The overlay is short-lived and removes itself.
    const t0 = window.setTimeout(() => setPhase("playing"), 0);
    const t1 = window.setTimeout(() => setPhase("leaving"), HOLD);
    const t2 = window.setTimeout(() => setPhase("done"), HOLD + 650);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "done" || phase === "idle") return null;

  return (
    <div
      aria-hidden="true"
      className={`welcome fixed inset-0 z-[90] grid place-items-center ${
        phase === "leaving" ? "welcome-out" : ""
      }`}
    >
      <div className="relative grid place-items-center">
        <span className="welcome-ring absolute h-[190px] w-[190px] rounded-full border-2 border-ember/45" />
        <span className="welcome-ring welcome-ring-2 absolute h-[150px] w-[150px] rounded-full border-2 border-gold/40" />
        <span className="welcome-mark relative">
          <LogoMark size={84} />
        </span>
      </div>

      <div className="welcome-word absolute bottom-[32%] text-center">
        <div className="text-[22px] font-semibold tracking-[-0.02em]">
          AB<span className="text-ember">Talks</span>
        </div>
        <div className="mt-1.5 text-[12px] text-faint">60 days of proof</div>
      </div>
    </div>
  );
}
