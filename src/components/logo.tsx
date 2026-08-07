"use client";

import { useId } from "react";

export function LogoMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  const id = useId();
  const g = `lg-${id.replace(/[:]/g, "")}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="ABTalks"
    >
      <defs>
        <linearGradient id={g} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--ember)" />
          <stop offset="60%" stopColor="var(--ember-soft)" />
          <stop offset="100%" stopColor="var(--gold)" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill={`url(#${g})`} />
      <rect x="8.5" y="24" width="4.6" height="7.5" rx="2.3" fill="#fff" opacity="0.55" />
      <rect x="15.6" y="18.5" width="4.6" height="13" rx="2.3" fill="#fff" opacity="0.78" />
      <rect x="22.7" y="13" width="4.6" height="18.5" rx="2.3" fill="#fff" />
      <path
        d="M26.4 11.4c-.5-2.2.3-4.4 1.9-5.9.1 2 1 2.9 2.1 4 1.2 1.2 2 2.5 2 4.3a4.55 4.55 0 0 1-9.1.2c0-1.5.7-2.6 1.6-3.5.3.6.9 1 1.5.9Z"
        fill="#fff"
      />
    </svg>
  );
}

export function Logo({
  size = 30,
  showWord = true,
  className = "",
}: {
  size?: number;
  showWord?: boolean;
  className?: string;
}) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <LogoMark size={size} />
      {showWord && (
        <span className="text-[16px] font-semibold tracking-[-0.02em] text-fg">
          AB<span className="text-ember">Talks</span>
        </span>
      )}
    </span>
  );
}
