"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { personas } from "@/lib/challenge";
import type { Persona, Submission } from "@/lib/types";

type SubmissionDraft = { repo: string; post: string; note: string };

type Ctx = {
  persona: Persona;
  personaId: string;
  setPersonaId: (id: string) => void;
  submissions: Record<number, Submission>;
  submitDay: (day: number, draft: SubmissionDraft) => void;
  repairedDays: number[];
  repairDay: (day: number) => void;
  shieldsLeft: number;
  isDone: (day: number) => boolean;
  ready: boolean;
};

const PersonaCtx = createContext<Ctx | null>(null);
const KEY = "abtalks.persona";

const listeners = new Set<() => void>();

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function readStored() {
  try {
    const saved = window.localStorage.getItem(KEY);
    if (saved && personas.some((p) => p.id === saved)) return saved;
  } catch {}
  return personas[0].id;
}

function writeStored(id: string) {
  try {
    window.localStorage.setItem(KEY, id);
  } catch {}
  listeners.forEach((fn) => fn());
}

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const personaId = useSyncExternalStore(subscribe, readStored, () => personas[0].id);
  const [store, setStore] = useState<Record<string, { subs: Record<number, Submission>; repaired: number[] }>>({});

  const setPersonaId = useCallback((id: string) => {
    writeStored(id);
  }, []);

  const persona = useMemo(
    () => personas.find((p) => p.id === personaId) ?? personas[0],
    [personaId],
  );

  const local = store[personaId] ?? { subs: {}, repaired: [] };

  const submitDay = useCallback(
    (day: number, draft: SubmissionDraft) => {
      setStore((prev) => {
        const cur = prev[personaId] ?? { subs: {}, repaired: [] };
        return {
          ...prev,
          [personaId]: {
            ...cur,
            subs: {
              ...cur.subs,
              [day]: {
                day,
                at: new Date().toISOString(),
                repo: draft.repo,
                post: draft.post,
              },
            },
          },
        };
      });
    },
    [personaId],
  );

  const repairDay = useCallback(
    (day: number) => {
      setStore((prev) => {
        const cur = prev[personaId] ?? { subs: {}, repaired: [] };
        if (cur.repaired.includes(day)) return prev;
        return { ...prev, [personaId]: { ...cur, repaired: [...cur.repaired, day] } };
      });
    },
    [personaId],
  );

  const repairedDays = useMemo(
    () => [...new Set([...persona.repairedDays, ...local.repaired])],
    [persona.repairedDays, local.repaired],
  );

  const isDone = useCallback(
    (day: number) =>
      persona.completedDays.includes(day) || repairedDays.includes(day) || Boolean(local.subs[day]),
    [persona.completedDays, repairedDays, local.subs],
  );

  const shieldsLeft = Math.max(0, persona.shields.available - local.repaired.length);

  const value: Ctx = {
    persona,
    personaId,
    setPersonaId,
    submissions: local.subs,
    submitDay,
    repairedDays,
    repairDay,
    shieldsLeft,
    isDone,
    ready: true,
  };

  return <PersonaCtx.Provider value={value}>{children}</PersonaCtx.Provider>;
}

export function usePersona() {
  const ctx = useContext(PersonaCtx);
  if (!ctx) throw new Error("usePersona must be used inside PersonaProvider");
  return ctx;
}
