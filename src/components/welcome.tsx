"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "@/components/logo";

const HOLD = 1400;
const CURTAIN = 950;

/**
 * Animated logo intro with a curtain reveal.
 *
 * The mark springs in between two panels, then the panels slide apart to
 * reveal the page beneath.
 *
 * Plays on every load of the home page. An earlier version gated this behind
 * `sessionStorage` so it only ran once per session — which meant a refresh
 * never replayed it and it appeared broken. For a portfolio/landing page the
 * brand moment is the point, and it is short enough not to become friction.
 *
 * Safety: purely decorative and `aria-hidden`. The real page is already
 * rendered underneath the whole time, so an automated screenshot or a JS
 * failure never sees a blank page. No scroll lock — an interrupted sequence
 * must never be able to leave the page unscrollable.
 */
function shouldPlay() {
  if (typeof window === "undefined") return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Welcome() {
  const [phase, setPhase] = useState<"idle" | "playing" | "opening" | "done">("idle");

  useEffect(() => {
    if (!shouldPlay()) {
      const skip = window.setTimeout(() => setPhase("done"), 0);
      return () => clearTimeout(skip);
    }

    const t0 = window.setTimeout(() => setPhase("playing"), 0);
    const t1 = window.setTimeout(() => setPhase("opening"), HOLD);
    const t2 = window.setTimeout(() => setPhase("done"), HOLD + CURTAIN);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "done" || phase === "idle") return null;

  const opening = phase === "opening";

  return (
    <div
      aria-hidden="true"
      className={`curtain fixed inset-0 z-[90] overflow-hidden ${opening ? "is-open" : ""}`}
    >
      {/* Two panels that split apart to reveal the page. */}
      <div className="curtain-panel curtain-left" />
      <div className="curtain-panel curtain-right" />

      {/* Seam of light down the middle, widening as the curtain parts. */}
      <span className="curtain-seam" />

      <div className="curtain-stage absolute inset-0 grid place-items-center">
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
    </div>
  );
}
