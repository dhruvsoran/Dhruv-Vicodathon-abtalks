"use client";

import Link from "next/link";
import { useState } from "react";
import { days as allDays } from "@/lib/challenge";
import type { DayStatus } from "@/lib/types";

const legend: { status: DayStatus; label: string; cell: string }[] = [
  { status: "done", label: "Shipped", cell: "bg-ember" },
  { status: "repaired", label: "Repaired", cell: "bg-gold/70" },
  { status: "missed", label: "Missed", cell: "bg-rose/25 ring-1 ring-inset ring-rose/60" },
  { status: "today", label: "Today", cell: "bg-surface-2 ring-1 ring-inset ring-gold" },
  { status: "upcoming", label: "Ahead", cell: "bg-surface-2" },
];

const cellClass: Record<DayStatus, string> = {
  done: "bg-ember text-white",
  repaired: "bg-gold/70 text-onbright",
  missed: "bg-rose/20 text-rose ring-1 ring-inset ring-rose/60",
  today: "bg-surface-2 text-gold ring-1 ring-inset ring-gold",
  upcoming: "bg-surface-2 text-faint",
};

export default function StreakCalendar({
  currentDay,
  completed,
  repaired,
  missed,
  totalDays,
}: {
  currentDay: number;
  completed: number[];
  repaired: number[];
  missed: number[];
  totalDays: number;
}) {
  const [picked, setPicked] = useState<number | null>(null);

  const statusOf = (d: number): DayStatus => {
    if (completed.includes(d)) return "done";
    if (repaired.includes(d)) return "repaired";
    if (missed.includes(d)) return "missed";
    if (d === currentDay) return "today";
    if (d < currentDay) return "missed";
    return "upcoming";
  };

  const pickedDay = picked ? allDays.find((d) => d.day === picked) : null;
  const pickedStatus = picked ? statusOf(picked) : null;

  return (
    <section className="card p-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[15px] font-semibold">Your 60 days</h2>
        <span className="text-[11px] text-faint">Tap a day</span>
      </div>

      <div className="mt-3.5 grid grid-cols-10 gap-[6px]">
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => {
          const st = statusOf(d);
          return (
            <button
              key={d}
              type="button"
              onClick={() => setPicked(picked === d ? null : d)}
              aria-label={`Day ${d}, ${st}`}
              aria-pressed={picked === d}
              className={`tap focusring grid aspect-square place-items-center rounded-[6px] font-mono text-[9px] transition-transform active:scale-95 ${cellClass[st]} ${
                picked === d ? "outline outline-2 outline-offset-1 outline-fg/70" : ""
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>

      <div className="mt-3.5 flex flex-wrap gap-x-3.5 gap-y-1.5">
        {legend.map((l) => (
          <span key={l.status} className="flex items-center gap-1.5 text-[10.5px] text-faint">
            <span className={`h-2.5 w-2.5 rounded-[3px] ${l.cell}`} />
            {l.label}
          </span>
        ))}
      </div>

      {pickedDay && (
        <div className="mt-3.5 rounded-xl border border-line bg-surface-2 p-3.5">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-faint">
              Day {pickedDay.day} · {pickedStatus}
            </span>
            <span className="text-[10.5px] text-faint">~{pickedDay.minutes} min</span>
          </div>
          <div className="mt-1.5 text-[13.5px] font-medium leading-snug">{pickedDay.title}</div>
          <p className="mt-1 text-[12px] leading-relaxed text-muted">{pickedDay.focus}</p>
          {pickedDay.day <= currentDay && (
            <Link
              href={`/day/${pickedDay.day}`}
              className="tap focusring mt-2.5 inline-flex text-[12px] font-medium text-ember"
            >
              Open Day {pickedDay.day} →
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
