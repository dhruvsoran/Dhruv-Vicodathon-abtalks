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
import { AvatarArt, GrowthArt, ProofArt, TrackGlyph } from "@/components/art";
import { LogoMark } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import SiteNav from "@/components/site-nav";
import Welcome from "@/components/welcome";
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
    <div className="card shine grain relative overflow-hidden p-4">
      <div
        aria-hidden="true"
        className="morph pointer-events-none absolute -right-10 -top-12 h-36 w-36 opacity-60 blur-[18px]"
        style={{ background: "linear-gradient(140deg, var(--ember), var(--gold))" }}
      />
      <div
        aria-hidden="true"
        className="morph-ring pointer-events-none absolute -right-6 -top-8 h-28 w-28"
      />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full ember-fill text-white">
            <FlameIcon className="breathe h-[18px] w-[18px]" />
          </span>
          <div>
            <div className="tickup text-[15px] font-semibold leading-none">11 day streak</div>
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
            style={{ animationDelay: `${180 + c * 22}ms` }}
            className={`pour aspect-square rounded-[3px] ${
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
      <Welcome />
      <SiteNav />

      <main id="main">
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-40 h-[460px] overflow-hidden">
          <div
            className="blob left-1/2 h-[300px] w-[300px] -translate-x-1/2"
            style={{
              background: "radial-gradient(circle, var(--ember) 0%, transparent 68%)",
              opacity: "calc(var(--glow-opacity) * 0.45)",
            }}
          />
          <div
            className="blob blob-b left-[8%] top-[90px] h-[210px] w-[210px]"
            style={{
              background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)",
              opacity: "calc(var(--glow-opacity) * 0.26)",
            }}
          />
          {/* Crisp morphing shapes: these carry the liquid read. */}
          <div
            className="morph absolute right-[6%] top-[188px] h-[130px] w-[130px] opacity-30 blur-[10px]"
            style={{ background: "linear-gradient(140deg, var(--ember), var(--gold))" }}
          />
          <div className="morph-ring absolute right-[10%] top-[196px] h-[112px] w-[112px]" />
          <div
            className="morph-slow absolute left-[4%] top-[236px] h-[74px] w-[74px] opacity-25 blur-[6px]"
            style={{ background: "linear-gradient(200deg, var(--sky), var(--ember))" }}
          />
        </div>
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
                  className="tap focusring press sheen group flex h-13 items-center justify-center gap-2 rounded-2xl ember-fill px-6 py-3.5 text-[15px] font-semibold text-white cta-shadow"
                >
                  Start Day 1 tonight
                  <ArrowIcon className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/day/12"
                  className="tap focusring press flex items-center justify-center rounded-2xl border border-line bg-surface px-6 py-3.5 text-[15px] font-medium text-fg"
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
        <Reveal>
          <h2 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] md:text-[34px]">
            You&apos;ve finished four tutorials.
            <br />
            <span className="text-faint">Nobody can tell.</span>
          </h2>
        </Reveal>
        <p className="mt-3.5 max-w-[52ch] text-[14px] leading-relaxed text-muted md:text-[16px]">
          Watch, follow along, forget. It leaves no trace. ABTalks replaces that loop with a
          smaller, harder habit: finish one thing tonight and put it where people can see it.
        </p>
        <Reveal>
          <div className="card mt-5 overflow-hidden p-3.5">
            <GrowthArt className="h-auto w-full" />
            <p className="mt-1.5 text-center text-[11.5px] text-faint">
              What 60 consistent nights look like on your profile
            </p>
          </div>
        </Reveal>
      </section>

      <section id="how-it-works" className="shell mt-12 scroll-mt-16 md:mt-20">
        <SectionLabel>How a day works</SectionLabel>
        <Reveal>
          <div className="card mb-5 overflow-hidden p-3.5">
            <ProofArt className="h-auto w-full" />
            <p className="mt-2.5 text-center text-[11.5px] text-faint">
              One commit + one post = one day of proof
            </p>
          </div>
        </Reveal>
        <div className="space-y-5 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
          {[
            {
              icon: <SparkIcon />,
              title: "1 · Open tonight's task",
              body: "One focused build, sized for after college. The why, the steps, and what counts as done.",
            },
            {
              icon: <GitHubIcon />,
              title: "2 · Push the commit",
              body: "Your code goes into a public repo. That's what proves you built it.",
            },
            {
              icon: <LinkedInIcon />,
              title: "3 · Post what you learned",
              body: "One short post, drafted for you from your own work — so the blank page never stops you.",
            },
          ].map((s, i) => (
            <Reveal key={s.title} delay={i * 90}>
              <ProofRow icon={s.icon} title={s.title} body={s.body} />
            </Reveal>
          ))}
        </div>
      </section>

      <section id="shields" className="shell mt-12 scroll-mt-16 md:mt-20">
        <Reveal>
          <div className="card relative overflow-hidden p-5 md:p-8">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 overflow-hidden">
              <div
                className="blob blob-b h-52 w-52"
                style={{
                  background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)",
                  opacity: "calc(var(--glow-opacity) * 0.3)",
                }}
              />
            </div>
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
                  Exams happen. Wi-Fi dies. Every 15 days you earn a Shield that repairs one missed
                  day within 48 hours — by shipping the catch-up proof. Students quit the day{" "}
                  <em className="not-italic text-fg">after</em> they slip, not the day they slip.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="curriculum" className="mt-12 scroll-mt-16 md:mt-20">
        <div className="shell">
          <SectionLabel>The 60 days</SectionLabel>
          <h2 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] md:text-[34px]">
            Nine weeks, one arc
          </h2>
          <p className="mt-3 max-w-[50ch] text-[14px] leading-relaxed text-muted">
            Start by making a repository. Finish with a deployed product and a portfolio arranged
            for recruiters.
          </p>
        </div>
        <div className="no-scrollbar mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:px-[max(40px,calc(50vw-540px))]">
          {weeks.map((w) => (
            <div
              key={w.n}
              className="card lift shine w-[224px] shrink-0 snap-start p-4"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-ember/12 font-mono text-[13px] font-semibold text-ember">
                  {w.n}
                </span>
                <span className="font-mono text-[10px] text-faint">{w.range}</span>
              </div>
              <h3 className="mt-2.5 text-[15px] font-semibold leading-snug">{w.theme}</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{w.blurb}</p>
              {/* Position of this week within the 60 days. */}
              <div
                className="mt-3 flex gap-[3px]"
                role="img"
                aria-label={`Week ${w.n} of 9`}
              >
                {weeks.map((x) => (
                  <span
                    key={x.n}
                    className={`h-1 flex-1 rounded-full ${
                      x.n <= w.n ? "ember-fill" : "bg-line-2"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="shell mt-12 md:mt-20">
        <SectionLabel>Sample tasks</SectionLabel>
        <ul className="card divide-y divide-line overflow-hidden">
          {sample.map((d, i) => (
            <Reveal as="li" key={d.day} delay={i * 60}>
              <div className="flex items-center gap-3.5 p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl ember-fill font-mono text-[12px] font-semibold text-white">
                  {d.day}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-medium">{d.title}</div>
                  <div className="mt-0.5 text-[11.5px] text-faint">
                    {d.difficulty} · ~{d.minutes} min · {d.tag}
                  </div>
                </div>
                <span className="shrink-0 text-faint">
                  <ChevronIcon className="h-4 w-4" />
                </span>
              </div>
            </Reveal>
          ))}
        </ul>

        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          {tracks.map((t, i) => (
            <Reveal key={t.id} delay={i * 60}>
              <div className="card lift shine h-full p-3.5">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-ember/12 text-ember">
                  <TrackGlyph id={t.id} className="h-[17px] w-[17px]" />
                </span>
                <div className="mt-2.5 text-[13.5px] font-semibold leading-snug">{t.name}</div>
                <p className="mt-1 text-[11px] leading-snug text-muted">{t.blurb}</p>
                <div className="mt-2 text-[10.5px] text-faint">
                  {formatCount(t.learners)} building
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Link
          href="/day/12"
          className="tap focusring press mt-3 flex items-center justify-center gap-1.5 rounded-2xl border border-line bg-surface px-5 py-3 text-[13.5px] font-medium"
        >
          Open Day 12 as a student sees it
          <ArrowIcon className="h-4 w-4" />
        </Link>
      </section>

      <section className="mt-12 md:mt-20">
        <div className="shell">
          <SectionLabel>From past cohorts</SectionLabel>
        </div>
        <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:px-[max(40px,calc(50vw-540px))]">
          {testimonials.map((t) => (
            <figure key={t.name} className="card lift shine w-[286px] shrink-0 snap-start p-4">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-ember/45" aria-hidden="true" fill="currentColor">
                <path d="M9.4 5.6c-3 1.4-4.9 4-4.9 7.3 0 3.2 1.9 5.5 4.5 5.5 2.1 0 3.7-1.5 3.7-3.5 0-1.9-1.4-3.3-3.2-3.3-.4 0-.8.1-1 .2.3-1.7 1.6-3.3 3.4-4.3l-2.5-1.9Zm9.1 0c-3 1.4-4.9 4-4.9 7.3 0 3.2 1.9 5.5 4.5 5.5 2.1 0 3.7-1.5 3.7-3.5 0-1.9-1.4-3.3-3.2-3.3-.4 0-.8.1-1 .2.3-1.7 1.6-3.3 3.4-4.3l-2.5-1.9Z" />
              </svg>
              <blockquote className="mt-2 text-[13.5px] leading-relaxed text-fg">
                {t.quote}
              </blockquote>
              <figcaption className="mt-3.5 flex items-center gap-2.5 border-t border-line pt-3">
                <AvatarArt
                  initials={t.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)}
                  size={30}
                />
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] font-medium">{t.name}</span>
                  <span className="block truncate text-[11px] text-faint">{t.detail}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="faq" className="shell mt-12 scroll-mt-16 md:mt-20">
        <SectionLabel>Questions</SectionLabel>
        <div className="card px-4">
          {faqs.map((f) => (
            <Faq key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      <section className="shell mt-12 md:mt-20">
        <Reveal>
          <div className="card shine grain relative overflow-hidden p-6 md:p-10">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -bottom-24 h-56 overflow-hidden">
              <div
                className="blob left-1/2 h-56 w-56 -translate-x-1/2"
                style={{
                  background: "radial-gradient(circle, var(--ember) 0%, transparent 70%)",
                  opacity: "calc(var(--glow-opacity) * 0.4)",
                }}
              />
            </div>
            <div className="relative text-center">
              <h2 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] md:text-[34px]">
                Day 1 takes 35 minutes.
              </h2>
              <p className="mx-auto mt-2.5 max-w-[38ch] text-[14px] leading-relaxed text-muted">
                Create a repo, write a README, push one commit. The other 59 only exist because you
                did that one.
              </p>
            </div>

            <ul className="relative mx-auto mt-5 max-w-[38ch] space-y-2 border-t border-line pt-5">
              {[
                "60 public commits on a GitHub graph that isn't empty",
                "60 posts recruiters can actually find",
                "A deployed capstone with a real README",
              ].map((line, i) => (
                <Reveal as="li" key={line} delay={i * 80}>
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full bg-mint/15 text-mint">
                      <CheckIcon className="h-2.5 w-2.5" />
                    </span>
                    <span className="text-[13px] leading-relaxed text-muted">{line}</span>
                  </div>
                </Reveal>
              ))}
            </ul>

            <div className="relative mt-5 text-center">
              <Link
                href="/dashboard"
                className="tap focusring press sheen inline-flex items-center justify-center gap-2 rounded-2xl ember-fill px-7 py-3.5 text-[15px] font-semibold text-white cta-shadow"
              >
                Join {cohort.name}
                <ArrowIcon className="h-[18px] w-[18px]" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      </main>

      <footer className="mt-14 border-t border-line">
        <div className="shell py-9">
          <div className="md:flex md:items-start md:justify-between md:gap-10">
            <div className="max-w-[46ch]">
              <div className="flex items-center gap-2">
                <LogoMark size={26} />
                <span className="text-[15px] font-semibold tracking-[-0.02em]">
                  AB<span className="text-ember">Talks</span>
                </span>
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-faint">
                Built for students who are tired of learning invisibly. Submissions run on{" "}
                {cohort.timezone}, daily cutoff {cohort.cutoffLabel}.
              </p>
            </div>

            <nav aria-label="Footer" className="mt-7 grid grid-cols-2 gap-x-8 gap-y-6 md:mt-0">
              <div>
                <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-faint">
                  Challenge
                </h2>
                <ul className="mt-2.5 space-y-2">
                  <li>
                    <Link href="/#how-it-works" className="tap focusring text-[12.5px] text-muted">
                      How it works
                    </Link>
                  </li>
                  <li>
                    <Link href="/#curriculum" className="tap focusring text-[12.5px] text-muted">
                      Curriculum
                    </Link>
                  </li>
                  <li>
                    <Link href="/#shields" className="tap focusring text-[12.5px] text-muted">
                      Streak Shields
                    </Link>
                  </li>
                  <li>
                    <Link href="/#faq" className="tap focusring text-[12.5px] text-muted">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-faint">
                  Product
                </h2>
                <ul className="mt-2.5 space-y-2">
                  <li>
                    <Link href="/dashboard" className="tap focusring text-[12.5px] text-muted">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/day/1" className="tap focusring text-[12.5px] text-muted">
                      Day 1
                    </Link>
                  </li>
                  <li>
                    <Link href="/day/12" className="tap focusring text-[12.5px] text-muted">
                      Day 12
                    </Link>
                  </li>
                  <li>
                    <Link href="/day/60" className="tap focusring text-[12.5px] text-muted">
                      Day 60
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>

          <p className="mt-8 border-t border-line pt-5 text-[11px] text-faint">
            © {new Date().getFullYear()} ABTalks · {cohort.name} · Made for Indian college students
          </p>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line glass-strong px-5 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 md:hidden">
        <Link
          href="/dashboard"
          className="tap focusring press flex items-center justify-center gap-2 rounded-2xl ember-fill py-3.5 text-[15px] font-semibold text-white"
        >
          Start Day 1 tonight
          <ArrowIcon className="h-[18px] w-[18px]" />
        </Link>
      </div>
    </div>
  );
}
