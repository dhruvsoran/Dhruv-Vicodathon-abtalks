"use client";

import { useState } from "react";
import { ChevronIcon } from "@/components/icons";
import { usePersona } from "@/components/persona-store";
import { personas } from "@/lib/challenge";

export default function PersonaSwitch() {
  const { personaId, setPersonaId, persona } = usePersona();
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-line bg-ink-2">
      <div className="shell py-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="tap focusring flex w-full items-center justify-between gap-3 py-1 text-left"
        >
          <span className="flex min-w-0 items-center gap-2">
            <span className="rounded-md bg-sky/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-sky">
              Demo
            </span>
            <span className="truncate text-[11.5px] text-muted">{persona.label}</span>
          </span>
          <ChevronIcon
            className={`h-3.5 w-3.5 shrink-0 text-faint transition-transform ${open ? "rotate-90" : ""}`}
          />
        </button>
        {open && (
          <div className="pb-2">
            <p className="mb-2 text-[11px] leading-relaxed text-faint">
              Mocked data. Switch student state to see how the interface handles each case.
            </p>
            <div className="grid gap-1.5">
              {personas.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setPersonaId(p.id);
                    setOpen(false);
                  }}
                  className={`tap focusring rounded-xl border px-3 py-2 text-left ${
                    p.id === personaId
                      ? "border-ember/60 bg-ember/10"
                      : "border-line bg-surface"
                  }`}
                >
                  <div className="text-[12.5px] font-medium">{p.label}</div>
                  <div className="mt-0.5 text-[11px] text-faint">{p.hint}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
