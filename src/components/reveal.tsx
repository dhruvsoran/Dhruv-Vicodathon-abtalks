"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

let sharedObserver: IntersectionObserver | null = null;
const registry = new WeakMap<Element, () => void>();

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Failsafe: entrance animations must never be able to hide content permanently.
 * If IntersectionObserver is unavailable, throttled, or never fires (headless
 * screenshot tools, some in-app browsers), everything reveals anyway.
 */
const FAILSAFE_MS = 1200;
const failsafeSubs = new Set<() => void>();
let failsafeFired = false;

function armFailsafe() {
  if (failsafeFired || typeof window === "undefined") return;
  window.setTimeout(() => {
    failsafeFired = true;
    failsafeSubs.forEach((fn) => fn());
    failsafeSubs.clear();
  }, FAILSAFE_MS);
}

function subscribeMotion(fn: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener("change", fn);
  return () => mq.removeEventListener("change", fn);
}

function getReduced() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOTION_QUERY).matches;
}

function observer() {
  if (sharedObserver) return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries, obs) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        registry.get(e.target)?.();
        registry.delete(e.target);
        obs.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
  );
  return sharedObserver;
}

/**
 * Scroll reveal driven by a single shared IntersectionObserver.
 * Animates transform + opacity only (compositor-friendly) and unobserves
 * after firing so nothing stays subscribed.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  as?: "div" | "section" | "li" | "span";
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);
  const reduced = useSyncExternalStore(subscribeMotion, getReduced, () => false);
  const noIO = typeof IntersectionObserver === "undefined";
  const shown = seen || reduced || noIO;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || noIO) return;

    const reveal = () => setSeen(true);
    if (failsafeFired) {
      const t = window.setTimeout(reveal, 0);
      return () => window.clearTimeout(t);
    }
    registry.set(el, reveal);
    observer().observe(el);

    failsafeSubs.add(reveal);
    armFailsafe();

    return () => {
      registry.delete(el);
      failsafeSubs.delete(reveal);
      observer().unobserve(el);
    };
  }, [reduced, noIO]);

  const Comp = Tag as React.ElementType;
  return (
    <Comp
      ref={ref}
      data-shown={shown ? "" : undefined}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${className}`}
    >
      {children}
    </Comp>
  );
}
