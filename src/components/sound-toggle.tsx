"use client";

import { useCallback, useSyncExternalStore } from "react";
import { isMuted, replayBrandSound, setMuted } from "@/lib/sound";

const listeners = new Set<() => void>();

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export default function SoundToggle({ className = "" }: { className?: string }) {
  // Server renders the unmuted icon; the real value is read after mount so
  // there is no hydration mismatch.
  const muted = useSyncExternalStore(subscribe, isMuted, () => false);

  const toggle = useCallback(() => {
    const next = !isMuted();
    setMuted(next);
    listeners.forEach((fn) => fn());
    // Replaying on unmute doubles as confirmation that audio works.
    if (!next) replayBrandSound();
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={!muted}
      aria-label={muted ? "Turn sound on" : "Turn sound off"}
      title={muted ? "Turn sound on" : "Turn sound off"}
      className={`tap focusring grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-muted transition-colors hover:text-fg ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" aria-hidden="true">
        <path
          d="M4 9.5h3.2L12 5.4v13.2L7.2 14.5H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z"
          fill="currentColor"
        />
        {muted ? (
          <path
            d="m16 9.5 4.5 5m0-5-4.5 5"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M15.6 9a4.2 4.2 0 0 1 0 6M18 6.6a7.6 7.6 0 0 1 0 10.8"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        )}
      </svg>
    </button>
  );
}
