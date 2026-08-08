"use client";

import { useState } from "react";
import { CheckIcon, ChevronIcon } from "@/components/icons";
import { usePersona } from "@/components/persona-store";
import { personas } from "@/lib/challenge";

/**
 * Demo state switcher.
 *
 * Rendered as an inset pill inside the page shell rather than a full-bleed
 * bar, so it reads as a tool that belongs to the prototype instead of a
 * detached browser chrome strip floating above the product.
 */
export default function PersonaSwitch() {
  const { personaId, setPersonaId, persona } = usePersona();
  const [open, setOpen] = useState(false);

  return (
    <div className="shell pt-3">
      <div
        className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
          open ? "border-sky/40 bg-sky/[0.06]" : "border-line/70 bg-surface-2/50"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="tap focusring press flex w-full items-center justify-between gap-3 px-3 py-2 text-left"
        >
          <span className="flex min-w-0 items-center gap-2">
            <span className="flex h-4 items-center rounded-md bg-sky/15 px-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-sky">
              Demo
            </span>
            <span className="truncate text-[11.5px] text-muted">{persona.label}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5 text-[10.5px] text-faint">
            {open ? "Close" : "Switch"}
            <ChevronIcon
              className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-90" : ""}`}
            />
          </span>
        </button>

        {open && (
          <div className="slidein border-t border-line/60 px-3 pb-3 pt-2.5">
            <p className="mb-2.5 text-[11px] leading-relaxed text-faint">
              Mocked data. Switch student state to see how the interface handles each edge case.
            </p>
            <div className="grid gap-1.5">
              {personas.map((p) => {
                const active = p.id === personaId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setPersonaId(p.id);
                      setOpen(false);
                    }}
                    aria-pressed={active}
                    className={`tap focusring press flex items-start gap-2.5 rounded-xl border px-3 py-2 text-left transition-colors ${
                      active ? "border-ember/60 bg-ember/10" : "border-line bg-surface"
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border transition-all ${
                        active
                          ? "border-ember bg-ember text-white"
                          : "border-line-2 text-transparent"
                      }`}
                    >
                      <CheckIcon className="h-2.5 w-2.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[12.5px] font-medium">{p.label}</span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-faint">
                        {p.hint}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
