"use client";

import { useEffect } from "react";

/**
 * Pointer-tracking glass shine.
 *
 * One delegated pointermove listener for the whole document, throttled to one
 * rAF per frame, writing two CSS custom properties. No per-card listeners, no
 * React state, and nothing runs on touch devices where there is no hover.
 */
export default function ShineLayer() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;

    let frame = 0;
    let pending: { el: HTMLElement; x: number; y: number } | null = null;

    const flush = () => {
      frame = 0;
      if (!pending) return;
      const { el, x, y } = pending;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
      pending = null;
    };

    const onMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const card = target?.closest<HTMLElement>(".shine");
      if (!card) return;
      const r = card.getBoundingClientRect();
      pending = {
        el: card,
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
      };
      if (!frame) frame = requestAnimationFrame(flush);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
