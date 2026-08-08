"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "@/components/logo";

/** Must match the end of the CSS sequence in globals.css. */
const TOTAL = 1950;

/**
 * Animated logo intro with a curtain reveal.
 *
 * Rendered in the **server HTML**, not mounted after hydration. An earlier
 * version started as `null` and only appeared from an effect, so the browser
 * painted the landing page first and the curtain dropped in a beat later —
 * exactly backwards. Because the markup ships with the document, the curtain
 * is part of the very first paint.
 *
 * The whole sequence is **CSS-driven with delays**, so it runs without
 * waiting for React. JavaScript is only used to unmount the finished element,
 * which means a hydration failure still leaves a page that reveals itself
 * correctly (the final keyframe sets `visibility: hidden` with `forwards`).
 *
 * Safety: `aria-hidden`, purely decorative, no scroll lock, and the real page
 * is rendered underneath the entire time.
 */
export default function Welcome() {
  // Identical on server and client, so there is no hydration mismatch.
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setDone(true), TOTAL);
    return () => clearTimeout(t);
  }, []);

  if (done) return null;

  return (
    <div aria-hidden="true" className="curtain">
      {/* Two panels that split apart to reveal the page. */}
      <div className="curtain-panel curtain-left" />
      <div className="curtain-panel curtain-right" />

      {/* Seam of light down the join, flashing as the curtain parts. */}
      <span className="curtain-seam" />

      <div className="curtain-stage">
        <div className="curtain-lockup">
          <span className="welcome-ring" />
          <span className="welcome-ring welcome-ring-2" />
          <span className="welcome-mark">
            <LogoMark size={84} />
          </span>
        </div>

        <div className="welcome-word">
          <div className="text-[22px] font-semibold tracking-[-0.02em]">
            AB<span className="text-ember">Talks</span>
          </div>
          <div className="mt-1.5 text-[12px] text-faint">60 days of proof</div>
        </div>
      </div>
    </div>
  );
}
