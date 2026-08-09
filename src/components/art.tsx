"use client";

import { useId } from "react";

/**
 * Product artwork.
 *
 * Deliberately SVG rather than photography: it costs no network requests, is
 * crisp at any density, adapts to both themes through CSS variables, and
 * shows the actual product story instead of generic stock imagery.
 */

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

/** Small glyphs so track cards read at a glance instead of as bare labels. */
export function TrackGlyph({ id, className = "" }: { id: string; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {id === "web" && (
        <>
          <path d="m9 8-4 4 4 4M15 8l4 4-4 4" {...common} />
        </>
      )}
      {id === "ai" && (
        <>
          <circle cx="12" cy="12" r="2.4" {...common} />
          <path d="M12 4.2v5.4M12 14.4v5.4M4.2 12h5.4M14.4 12h5.4M6.6 6.6l3.1 3.1M14.3 14.3l3.1 3.1M17.4 6.6l-3.1 3.1M9.7 14.3l-3.1 3.1" {...common} />
        </>
      )}
      {id === "mobile" && (
        <>
          <rect x="7" y="3.2" width="10" height="17.6" rx="2.6" {...common} />
          <path d="M11 17.6h2" {...common} />
        </>
      )}
      {id === "systems" && (
        <>
          <path d="M4 17.5 9 12l3.4 3.4L20 7.2" {...common} />
          <path d="M15.4 7.2H20v4.6" {...common} />
        </>
      )}
    </svg>
  );
}

/** Compact sparkline for dashboard metric cards. */
export function Spark({
  points,
  className = "",
}: {
  points: number[];
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const max = Math.max(...points, 1);
  const w = 100;
  const h = 28;
  const step = points.length > 1 ? w / (points.length - 1) : w;
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)} ${(h - (p / max) * (h - 4) - 2).toFixed(1)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`s${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--ember)" stopOpacity=".45" />
          <stop offset="100%" stopColor="var(--gold)" />
        </linearGradient>
      </defs>
      <path d={`${path} L${w} ${h} L0 ${h} Z`} fill="var(--ember)" opacity=".08" />
      <path d={path} fill="none" stroke={`url(#s${id})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
