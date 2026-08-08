"use client";

import { useId } from "react";

/**
 * Product artwork.
 *
 * Deliberately SVG rather than photography: it costs no network requests, is
 * crisp at any density, adapts to both themes through CSS variables, and
 * shows the actual product story instead of generic stock imagery.
 */

export function ProofArt({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 320 150"
      className={className}
      role="img"
      aria-label="A commit and a post together forming one day of proof"
    >
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--ember)" />
          <stop offset="100%" stopColor="var(--gold)" />
        </linearGradient>
      </defs>

      {/* editor window */}
      <rect x="6" y="16" width="140" height="112" rx="12" fill="var(--surface-2)" stroke="var(--line)" />
      <circle cx="22" cy="32" r="3.2" fill="var(--rose)" opacity=".7" />
      <circle cx="33" cy="32" r="3.2" fill="var(--gold)" opacity=".7" />
      <circle cx="44" cy="32" r="3.2" fill="var(--mint)" opacity=".7" />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x="22"
          y={50 + i * 16}
          width={[86, 60, 100, 44][i]}
          height="7"
          rx="3.5"
          fill="var(--line-2)"
        />
      ))}
      <rect x="22" y="50" width="30" height="7" rx="3.5" fill={`url(#g${id})`} />

      {/* connector */}
      <path
        d="M150 72h20"
        stroke="var(--line-2)"
        strokeWidth="2"
        strokeDasharray="4 4"
        strokeLinecap="round"
      />

      {/* post card */}
      <rect x="174" y="16" width="140" height="112" rx="12" fill="var(--surface-2)" stroke="var(--line)" />
      <circle cx="192" cy="36" r="8" fill={`url(#g${id})`} />
      <rect x="206" y="31" width="46" height="6" rx="3" fill="var(--line-2)" />
      <rect x="206" y="41" width="30" height="5" rx="2.5" fill="var(--line)" />
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x="192"
          y={60 + i * 14}
          width={[104, 88, 66][i]}
          height="6"
          rx="3"
          fill="var(--line-2)"
        />
      ))}
      <rect x="192" y="104" width="42" height="12" rx="6" fill="var(--ember)" opacity=".22" />
      <rect x="240" y="104" width="30" height="12" rx="6" fill="var(--line-2)" opacity=".6" />
    </svg>
  );
}

export function GrowthArt({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const bars = [14, 20, 17, 28, 34, 30, 42, 48, 44, 58, 66, 78];
  return (
    <svg
      viewBox="0 0 320 120"
      className={className}
      role="img"
      aria-label="Daily commits compounding across sixty days"
    >
      <defs>
        <linearGradient id={`b${id}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--ember)" stopOpacity=".35" />
          <stop offset="100%" stopColor="var(--gold)" />
        </linearGradient>
      </defs>
      <line x1="0" y1="104" x2="320" y2="104" stroke="var(--line)" strokeWidth="1" />
      {bars.map((h, i) => (
        <rect
          key={i}
          x={10 + i * 26}
          y={104 - h}
          width="15"
          height={h}
          rx="5"
          fill={`url(#b${id})`}
          className="growbar"
          style={{ animationDelay: `${i * 70}ms` }}
        />
      ))}
    </svg>
  );
}

export function AvatarArt({
  initials,
  size = 40,
  className = "",
}: {
  initials: string;
  size?: number;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={`a${id}`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--ember)" stopOpacity=".28" />
            <stop offset="100%" stopColor="var(--sky)" stopOpacity=".28" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" fill={`url(#a${id})`} />
      </svg>
      <span
        className="relative font-semibold text-fg"
        style={{ fontSize: Math.round(size * 0.34) }}
      >
        {initials}
      </span>
    </span>
  );
}
