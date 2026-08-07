import challenge from "@/data/challenge.json";
import roster from "@/data/students.json";
import type { ChallengeDay, Cohort, DayDetail, Persona, Week } from "./types";

export const cohort = challenge.cohort as Cohort;
export const weeks = challenge.weeks as Week[];
export const days = challenge.days as ChallengeDay[];
export const personas = roster.personas as unknown as Persona[];
export const testimonials = roster.testimonials;
export const tracks = roster.tracks;
export const faqs = roster.faqs;
export const leaderboardPeers = roster.leaderboardPeers;

const detailMap = challenge.details as Record<string, DayDetail>;

export function getDay(n: number): ChallengeDay | undefined {
  return days.find((d) => d.day === n);
}

export function getDetail(n: number): DayDetail {
  const found = detailMap[String(n)];
  if (found) return found;
  const day = getDay(n);
  return {
    why: `Day ${n} builds directly on what you shipped yesterday. The goal is one more small, provable step you can point a recruiter at.`,
    build: [
      day?.focus ?? "Complete today's task.",
      "Keep the scope to what you can finish tonight.",
      "Commit your work to a public repository.",
      "Write a short post explaining one thing you learned.",
    ],
    acceptance: [
      "The repository is public and the commit is from today.",
      "The post explains what you built in your own words.",
    ],
    stretch: "Refactor one thing from an earlier day using what you learned today.",
    resources: [],
  };
}

export function weekOf(day: number) {
  const n = Math.min(9, Math.ceil(day / 7));
  return weeks.find((w) => w.n === n) ?? weeks[0];
}

export function currentStreak(p: {
  currentDay: number;
  completedDays: number[];
  repairedDays: number[];
}) {
  const ok = new Set([...p.completedDays, ...p.repairedDays]);
  let streak = 0;
  for (let d = p.currentDay; d >= 1; d--) {
    if (ok.has(d)) streak++;
    else if (d === p.currentDay) continue;
    else break;
  }
  return streak;
}

export function longestStreak(p: { completedDays: number[]; repairedDays: number[] }) {
  const ok = [...new Set([...p.completedDays, ...p.repairedDays])].sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  let prev = -1;
  for (const d of ok) {
    run = d === prev + 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}

export function xpEarned(p: { completedDays: number[]; repairedDays: number[] }) {
  const ok = new Set([...p.completedDays, ...p.repairedDays]);
  return days.filter((d) => ok.has(d.day)).reduce((sum, d) => sum + d.xp, 0);
}

export function pct(part: number, whole: number) {
  if (whole <= 0) return 0;
  return Math.round((part / whole) * 100);
}

export function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

export function formatCount(n: number) {
  return n.toLocaleString("en-IN");
}

export function draftPost(input: {
  day: number;
  title: string;
  name: string;
  learned: string;
  repo: string;
  track: string;
}) {
  const learned = input.learned.trim() || "how much easier this gets when the task is small enough to actually finish.";
  const repoLine = input.repo.trim() ? `\nCode: ${input.repo.trim()}` : "";
  return `Day ${input.day} of 60 — ABTalks ${input.track} Challenge

Today's build: ${input.title}

What I learned: ${learned}${repoLine}

Small steps, every day, in public.

#ABTalks #60DaysOfCode #BuildInPublic`;
}
