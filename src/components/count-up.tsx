"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated number that counts from 0 to `to` when it scrolls into view.
 * Keeps a stable inline min-width so the animation never shifts layout (CLS),
 * and jumps straight to the final value under prefers-reduced-motion.
 */
export default function CountUp({
  to,
  duration = 1500,
  className = "",
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  const final = to.toLocaleString("en-IN");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let io: IntersectionObserver | null = null;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = () => {
      if (reduced) {
        setN(to);
        return;
      }
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(Math.round(to * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === "undefined") {
      start();
      return () => cancelAnimationFrame(raf);
    }
    io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          start();
          io?.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span
      ref={ref}
      className={`inline-block text-left tabular-nums ${className}`}
      style={{ minWidth: `${final.length}ch` }}
    >
      {n.toLocaleString("en-IN")}
    </span>
  );
}
