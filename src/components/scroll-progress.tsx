"use client";

import { useEffect, useRef } from "react";

/**
 * Reading-progress bar for the landing page.
 *
 * Writes directly to the element's transform inside a rAF, so scrolling never
 * triggers a React render. Uses scaleX rather than width so the update stays
 * on the compositor and cannot cause layout.
 */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      el.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="scrollbar-progress w-full"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
