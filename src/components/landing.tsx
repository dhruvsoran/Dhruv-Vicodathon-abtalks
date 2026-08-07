"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowIcon,
  CheckIcon,
  ChevronIcon,
  FlameIcon,
  GitHubIcon,
  LinkedInIcon,
  ShieldIcon,
  SparkIcon,
} from "@/components/icons";
import { cohort, days, faqs, formatCount, testimonials, tracks, weeks } from "@/lib/challenge";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="text-[22px] font-semibold leading-none tracking-tight">{value}</div>
      <div className="mt-1.5 text-[11px] leading-tight text-faint">{label}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-faint">
      <span className="h-px w-5 bg-line-2" />
      {children}
    </div>
  );
}

function PreviewStrip() {
  const cells = Array.from({ length: 28 }, (_, i) => i + 1);
  return (
    <div className="card grain relative overflow-hidden p-4">
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full ember-fill text-white">
            <FlameIcon className="h-[18px] w-[18px]" />
          </span>
          <div>
            <div className="text-[15px] font-semibold leading-none">11 day streak</div>
            <div className="mt-1 text-[11px] text-faint">Day 12 unlocks tonight</div>
          </div>
        </div>
        <span className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[10px] font-medium text-muted">
          Top 8%
        </span>
      </div>
      <div className="relative mt-4 grid grid-cols-14 gap-[5px]">
        {cells.map((c) => (
          <span
            key={c}
            className={`aspect-square rounded-[3px] ${
              c <= 11
                ? "bg-ember"
                : c === 12
                  ? "bg-gold/30 ring-1 ring-gold"
                  : "bg-surface-2"
            }`}
          />
        ))}
      </div>
      <div className="relative mt-3 flex items-center gap-3 text-[11px] text-faint">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-[2px] bg-ember" /> shipped
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-[2px] bg-gold/40 ring-1 ring-gold" /> today
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-[2px] bg-surface-2" /> ahead
        </span>
      </div>
    </div>
  );
}

function ProofRow({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex gap-3.5">
      <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-fg">
        {icon}
      </span>
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold leading-snug">{title}</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">{body}</p>
      </div>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="tap focusring flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-[14px] font-medium leading-snug">{q}</span>
        <ChevronIcon
          className={`h-4 w-4 shrink-0 text-faint transition-transform duration-200 ${open ? "rotate-90" : ""}`}
        />
      </button>
      {open && <p className="-mt-1 pb-4 pr-6 text-[13px] leading-relaxed text-muted">{a}</p>}
    </div>
  );
}

export default function Landing() {
  const sample = [days[0], days[6], days[11], days[29], days[59]];

  return (
    <div className="pb-28">
      <header className="sticky top-0 z-40 border-b border-line/80 bg-ink/85 backdrop-blur-xl">
        <div className="shell flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg ember-fill text-[12px] font-bold text-white">
              AB
            </span>
            <span className="text-[15px] font-semibold tracking-tight">ABTalks</span>
          </div>
          <Link
            href="/dashboard"
            className="tap focusring rounded-full border border-line bg-surface px-3.5 py-1.5 text-[12px] font-medium text-fg"
          >
            Sign in
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-45 blur-[90px]"
          style={{ background: "radial-gradient(circle, #ff5a1f 0%, transparent 68%)" }}
        />
        <div className="shell relative pt-9 md:pt-16">
          <div className="md:grid md:grid-cols-2 md:items-center md:gap-14">
            <div className="rise">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-medium text-muted">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-mint" />
                </span>
                {cohort.name} is live · {formatCount(cohort.studentsEnrolled)} students building
              </span>

              <h1 className="mt-5 text-[38px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[58px]">
                60 days.
                <br />
                60 proofs.
                <br />
                <span className="ember-text">One you.</span>
              </h1>

              <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-muted md:text-[17px]">
                A daily coding challenge for Indian college students. Build one small thing every
                night, push the commit, post what you learned. In two months you stop saying you can
                code and start showing it.
              </p>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="tap focusring group flex h-13 items-center justify-center gap-2 rounded-2xl ember-fill px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_30px_-12px_rgba(255,90,31,0.9)]"
                >
                  Start Day 1 tonight
                  <ArrowIcon className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/day/12"
                  className="tap focusring flex items-center justify-center rounded-2xl border border-line bg-surface px-6 py-3.5 text-[15px] font-medium text-fg"
                >
                  See a real day
                </Link>
              </div>

              <p className="mt-3 text-[12px] text-faint">
                Free forever · No interview · Starts the moment you sign up
              </p>

              <div className="mt-7 flex gap-4 border-t border-line pt-5">
                <Stat value={formatCount(cohort.studentsEnrolled)} label="students in this cohort" />
                <Stat value={`${cohort.collegesRepresented}`} label="colleges represented" />
                <Stat value="45–75m" label="typical night" />
              </div>
            </div>

            <div className="mt-9 md:mt-0">
              <PreviewStrip />
            </div>
          </div>
        </div>
      </section>

      <section className="shell mt-14 md:mt-24">
        <SectionLabel>The problem</SectionLabel>
        <h2 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] md:text-[34px]">
          You&apos;ve finished four tutorials.
          <br />
          <span className="text-faint">Nobody can tell.</span>
        </h2>
        <p className="mt-3.5 max-w-[52ch] text-[14px] leading-relaxed text-muted md:text-[16px]">
          Watching, following along and forgetting is the default loop. It leaves no trace. A
          recruiter opening your GitHub sees an empty grid and a resume that sounds like everyone
          else&apos;s. ABTalks replaces the loop with a much smaller, harder habit: finish one thing
          tonight and put it where people can see it.
        </p>
      </section>

      <section className="shell mt-12 md:mt-20">
        <SectionLabel>How a day works</SectionLabel>
        <div className="space-y-5 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
          <ProofRow
            icon={<SparkIcon />}
            title="1 · Open tonight's task"
            body="One focused build, sized for after college. You get the why, the exact steps, and what counts as done."
          />
          <ProofRow
            icon={<GitHubIcon />}
            title="2 · Push the commit"
            body="Your code goes into a public repo. That's the part that proves you actually built it."
          />
          <ProofRow
            icon={<LinkedInIcon />}
            title="3 · Post what you learned"
            body="One short post. We draft it for you from your own work, so the blank page never stops you at midnight."
          />
        </div>
      </section>

      <section className="shell mt-12 md:mt-20">
        <div className="card relative overflow-hidden p-5 md:p-8">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full opacity-30 blur-[70px]"
            style={{ background: "radial-gradient(circle, #ffb020 0%, transparent 70%)" }}
          />
          <div className="relative flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold/15 text-gold">
              <ShieldIcon className="h-6 w-6" />
            </span>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-gold">
                Streak Shields
              </div>
              <h3 className="mt-1.5 text-[20px] font-semibold leading-snug tracking-tight md:text-[24px]">
                One bad night shouldn&apos;t end two months of work.
              </h3>
              <p className="mt-2.5 max-w-[50ch] text-[14px] leading-relaxed text-muted">
                Exams happen. Wi-Fi dies. Every 15 days you earn a Shield that lets you repair one
                missed day within 48 hours by shipping the catch-up proof. You keep the streak, and
                the day still has to be earned. Most students quit on the day after they slip, not
                the day they slip.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 md:mt-20">
        <div className="shell">
          <SectionLabel>The 60 days</SectionLabel>
          <h2 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] md:text-[34px]">
            Nine weeks, one arc
          </h2>
          <p className="mt-3 max-w-[50ch] text-[14px] leading-relaxed text-muted">
            You start by making a repository. You finish with a deployed product and a portfolio
            arranged for recruiters.
          </p>
        </div>
        <div className="no-scrollbar mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:px-[max(40px,calc(50vw-540px))]">
          {weeks.map((w) => (
            <div
              key={w.n}
              className="card w-[224px] shrink-0 snap-start p-4"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-faint">
                  Week {w.n}
                </span>
                <span className="font-mono text-[10px] text-faint">{w.range}</span>
              </div>
              <h3 className="mt-2.5 text-[15px] font-semibold leading-snug">{w.theme}</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{w.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="shell mt-12 md:mt-20">
        <SectionLabel>Sample tasks</SectionLabel>
        <ul className="card divide-y divide-line overflow-hidden">
          {sample.map((d) => (
            <li key={d.day} className="flex items-center gap-3.5 p-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 font-mono text-[12px] text-muted">
                {d.day}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-medium">{d.title}</div>
                <div className="mt-0.5 text-[11.5px] text-faint">
                  {d.difficulty} · ~{d.minutes} min · {d.tag}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Link
          href="/day/12"
          className="tap focusring mt-3 flex items-center justify-center gap-1.5 rounded-2xl border border-line bg-surface px-5 py-3 text-[13.5px] font-medium"
        >
          Open Day 12 as a student sees it
          <ArrowIcon className="h-4 w-4" />
        </Link>
      </section>

      <section className="shell mt-12 md:mt-20">
        <SectionLabel>Pick a track</SectionLabel>
        <div className="grid grid-cols-2 gap-2.5">
          {tracks.map((t) => (
            <div key={t.id} className="card p-3.5">
              <div className="text-[13.5px] font-semibold leading-snug">{t.name}</div>
              <p className="mt-1 text-[11.5px] leading-relaxed text-muted">{t.blurb}</p>
              <div className="mt-2.5 text-[10.5px] text-faint">
                {formatCount(t.learners)} building
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 md:mt-20">
        <div className="shell">
          <SectionLabel>From past cohorts</SectionLabel>
        </div>
        <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:px-[max(40px,calc(50vw-540px))]">
          {testimonials.map((t) => (
            <figure key={t.name} className="card w-[286px] shrink-0 snap-start p-4">
              <blockquote className="text-[13.5px] leading-relaxed text-fg">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-3.5 border-t border-line pt-3">
                <div className="text-[12.5px] font-medium">{t.name}</div>
                <div className="mt-0.5 text-[11px] text-faint">{t.detail}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="shell mt-12 md:mt-20">
        <SectionLabel>What you walk away with</SectionLabel>
        <ul className="space-y-2.5">
          {[
            "60 public commits on a GitHub graph that is no longer empty",
            "60 LinkedIn posts that recruiters can actually find",
            "A deployed capstone project with a real README and a demo video",
            "A portfolio arranged so a recruiter understands you in 15 seconds",
          ].map((line) => (
            <li key={line} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint/15 text-mint">
                <CheckIcon className="h-3 w-3" />
              </span>
              <span className="text-[14px] leading-relaxed text-muted">{line}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell mt-12 md:mt-20">
        <SectionLabel>Questions</SectionLabel>
        <div className="card px-4">
          {faqs.map((f) => (
            <Faq key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      <section className="shell mt-12 md:mt-20">
        <div className="card grain relative overflow-hidden p-6 text-center md:p-10">
          <div
            className="pointer-events-none absolute inset-x-0 -bottom-24 mx-auto h-56 w-56 rounded-full opacity-40 blur-[80px]"
            style={{ background: "radial-gradient(circle, #ff5a1f 0%, transparent 70%)" }}
          />
          <div className="relative">
            <h2 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] md:text-[34px]">
              Day 1 takes 35 minutes.
            </h2>
            <p className="mx-auto mt-2.5 max-w-[38ch] text-[14px] leading-relaxed text-muted">
              Create a repo, write a README, push one commit. That&apos;s the whole first day. The
              other 59 only exist because you did that one.
            </p>
            <Link
              href="/dashboard"
              className="tap focusring mt-5 inline-flex items-center justify-center gap-2 rounded-2xl ember-fill px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_30px_-12px_rgba(255,90,31,0.9)]"
            >
              Join {cohort.name}
              <ArrowIcon className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="shell mt-12 border-t border-line py-8 text-[11.5px] text-faint">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-md ember-fill text-[10px] font-bold text-white">
            AB
          </span>
          <span className="font-medium text-muted">ABTalks</span>
        </div>
        <p className="mt-3 max-w-[46ch] leading-relaxed">
          Built for students who are tired of learning invisibly. Submissions run on {cohort.timezone},
          daily cutoff {cohort.cutoffLabel}.
        </p>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/90 px-5 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden">
        <Link
          href="/dashboard"
          className="tap focusring flex items-center justify-center gap-2 rounded-2xl ember-fill py-3.5 text-[15px] font-semibold text-white"
        >
          Start Day 1 tonight
          <ArrowIcon className="h-[18px] w-[18px]" />
        </Link>
      </div>
    </div>
  );
}
