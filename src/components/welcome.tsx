"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "@/components/logo";
import { playBrandSound, primeAudio } from "@/lib/sound";

/** Must match the CSS sequence in globals.css. */
const PART_AT = 1400;
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
 * Plays on a genuine document load only — a first visit, a refresh, or an
 * external link. It must NOT replay on client-side navigation: clicking the
 * logo on `/dashboard` to return home remounts this component, and a curtain
 * dropping over a route change reads as a glitch rather than a welcome.
 *
 * The guard is a module-scope flag. Module state survives React remounts and
 * client-side route changes but is discarded on a real page load, which is
 * exactly the distinction required. `sessionStorage` would be wrong here
 * because it also outlives reloads, so refreshing would never replay it.
 *
 * Safety: `aria-hidden`, purely decorative, no scroll lock, and the real page
 * is rendered underneath the entire time.
 */
let consumed = false;

export default function Welcome() {
  // On the first document load this is `false` on both server and client, so
  // hydration matches. On a later client-side navigation it is already
  // `true`, and the component renders nothing.
  const [done, setDone] = useState(() => consumed);

  useEffect(() => {
    // Runs once per real page load. `consumed` is module-scope, so a second
    // invocation (React StrictMode double-mounts effects in dev) is a no-op.
    if (consumed) return;
    consumed = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.setTimeout(() => setDone(true), 0);
      return;
    }

    // Warm the audio context now so any interaction before the reveal has
    // already satisfied the browser's autoplay policy.
    primeAudio();

    // Fire the brand sound on the beat the panels start to part. These
    // timers must NOT be cleaned up on unmount: StrictMode runs the effect's
    // cleanup immediately after the first mount, and clearing the sound here
    // would silently cancel the intro sound on every dev load.
    window.setTimeout(() => playBrandSound(), PART_AT);
    window.setTimeout(() => setDone(true), TOTAL);
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
