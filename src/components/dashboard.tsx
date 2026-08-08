"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertIcon,
  ArrowIcon,
  CheckIcon,
  ClockIcon,
  FlameIcon,
  GitHubIcon,
  LinkedInIcon,
  ShieldIcon,
  SparkIcon,
  TrophyIcon,
} from "@/components/icons";
import { LogoMark } from "@/components/logo";
import PersonaSwitch from "@/components/persona-switch";
import StreakCalendar from "@/components/streak-calendar";
import TabBar from "@/components/tab-bar";
import { ThemeToggle } from "@/components/theme";
import { usePersona } from "@/components/persona-store";
import {
  cohort,
  currentStreak,
  formatCount,
  getDay,
  leaderboardPeers,
  longestStreak,
  ordinal,
  pct,
  weekOf,
  xpEarned,
} from "@/lib/challenge";

/**
 * Renders a stable placeholder on the server and until the first tick, so the
 * label never grows from empty to full width and shifts the layout (CLS).
 */
function useCountdown(cutoffHour = 24) {
  const [label, setLabel] = useState("Due 11:59 PM IST");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(cutoffHour, 0, 0, 0);
      const ms = end.getTime() - now.getTime();
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      setLabel(h > 0 ? `${h}h ${m}m left today` : `${m}m left today`);
    };
    const id0 = setTimeout(tick, 0);
    const id = setInterval(tick, 30000);
    return () => {
      clearTimeout(id0);
      clearInterval(id);
    };
  }, [cutoffHour]);
  return label;
}

function Ring({ value, size = 74 }: { value: number; size?: number }) {
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-line-2)" strokeWidth={stroke} />
      <circle
        className="draw"
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="url(#ring)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (c * value) / 100}
        style={{ "--dash-from": `${c}px` } as React.CSSProperties}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <defs>
        <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff5a1f" />
          <stop offset="100%" stopColor="#ffb020" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function MetricCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub: string;
  tone?: "default" | "warn";
}) {
  return (
    <div className="card lift shine h-full p-3.5">
      <div className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-faint">{label}</div>
      <div
        className={`mt-1.5 text-[21px] font-semibold leading-none tracking-tight ${
          tone === "warn" ? "text-rose" : ""
        }`}
      >
        {value}
      </div>
      <div className="mt-1.5 text-[11px] leading-tight text-faint">{sub}</div>
    </div>
  );
}

export default function Dashboard() {
  const { persona, isDone, repairedDays, repairDay, shieldsLeft, ready } = usePersona();
  const countdown = useCountdown();

  const completed = persona.completedDays;
  const allDone = [...new Set([...completed, ...repairedDays])];
  const streak = currentStreak({
    currentDay: persona.currentDay,
    completedDays: completed,
    repairedDays,
  });
  const best = longestStreak({ completedDays: completed, repairedDays });
  const xp = xpEarned({ completedDays: completed, repairedDays });
  const completion = pct(allDone.length, cohort.totalDays);
  const today = getDay(persona.currentDay);
  const week = weekOf(persona.currentDay);
  const doneToday = isDone(persona.currentDay);
  const repairable = persona.missedDays.filter((d) => !repairedDays.includes(d));
  const isNew = allDone.length === 0 && persona.currentDay === 1;
  const profileMissing = Object.entries(persona.student.profileFields)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  const profileScore = pct(
    Object.values(persona.student.profileFields).filter(Boolean).length,
    Object.values(persona.student.profileFields).length,
  );

  const board = leaderboardPeers.map((p) =>
    p.isYou
      ? { ...p, name: persona.student.name, college: persona.student.college || "—", streak, xp }
      : p,
  );

  if (!ready) {
    return <div className="min-h-screen bg-ink" />;
  }

  return (
    <div className="pb-24 md:pb-12">
      <PersonaSwitch />

      <header className="shell flex items-center justify-between gap-3 pt-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" aria-label="ABTalks home" className="tap focusring shrink-0 rounded-lg">
            <LogoMark size={30} />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-[16px] font-semibold leading-tight">
              {isNew ? `Welcome, ${persona.student.name.split(" ")[0]}` : `Hey ${persona.student.name.split(" ")[0]}`}
            </h1>
            <p className="mt-0.5 truncate text-[11.5px] text-faint">
              {persona.student.college || "Add your college"} · {persona.student.track}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <span className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface-2 text-[12px] font-semibold">
            {persona.student.initials}
          </span>
        </div>
      </header>

      <main id="main" className="md:shell md:grid md:grid-cols-[1.15fr_0.85fr] md:items-start md:gap-6">
        <div className="md:contents">
          <section className="shell mt-4 md:col-start-1 md:mx-0 md:max-w-none md:px-0">
            <div
              className={`card grain relative overflow-hidden p-4 ${
                doneToday ? "border-mint/40" : ""
              }`}
            >
              <div className="relative flex items-center gap-4">
                <div className="relative grid place-items-center">
                  <Ring value={completion} />
                  <span className="absolute grid place-items-center text-center">
                    <span className="text-[17px] font-semibold leading-none">{streak}</span>
                    <span className="mt-0.5 text-[8.5px] uppercase tracking-[0.1em] text-faint">
                      day{streak === 1 ? "" : "s"}
                    </span>
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  {isNew ? (
                    <>
                      <div className="flex items-center gap-1.5 text-[13px] font-semibold text-gold">
                        <SparkIcon className="h-4 w-4" />
                        Your streak starts tonight
                      </div>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
                        Nothing here yet, and that&apos;s fine. One commit today makes this a 1.
                      </p>
                    </>
                  ) : streak === 0 ? (
                    <>
                      <div className="flex items-center gap-1.5 text-[13px] font-semibold text-rose">
                        <AlertIcon className="h-4 w-4" />
                        Streak reset on Day {persona.missedDays[0]}
                      </div>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
                        You still have {allDone.length} days shipped. That doesn&apos;t disappear.
                        Today rebuilds it.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5 text-[13px] font-semibold text-ember">
                        <FlameIcon className="breathe h-4 w-4" />
                        {streak} day streak · best {best}
                      </div>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
                        {doneToday
                          ? "Day locked in. Come back tomorrow."
                          : `Keep it alive. ${countdown}.`}
                      </p>
                    </>
                  )}

                  <div className="mt-2.5 flex items-center gap-2 text-[11px] text-faint">
                    <span>
                      {allDone.length}/{cohort.totalDays} days
                    </span>
                    <span className="h-3 w-px bg-line-2" />
                    <span>{completion}% complete</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {repairable.length > 0 && (
            <section className="shell mt-3 md:col-start-1 md:mx-0 md:max-w-none md:px-0">
              <div className="card border-gold/40 bg-gold/[0.06] p-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold">
                    <ShieldIcon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[13.5px] font-semibold leading-snug">
                      Day {repairable[0]} is repairable for {shieldsLeft > 0 ? "39 more hours" : "—"}
                    </h3>
                    <p className="mt-1 text-[12px] leading-relaxed text-muted">
                      {shieldsLeft > 0
                        ? `Ship the Day ${repairable[0]} proof and your ${allDone.length}-day record reconnects. You have ${shieldsLeft} shield left.`
                        : "No shields left. You earn one every 15 days — the next arrives on Day 15."}
                    </p>
                    {shieldsLeft > 0 && (
                      <div className="mt-2.5 flex gap-2">
                        <Link
                          href={`/day/${repairable[0]}`}
                          className="tap focusring rounded-xl bg-gold px-3.5 py-2 text-[12.5px] font-semibold text-onbright"
                        >
                          Repair Day {repairable[0]}
                        </Link>
                        <button
                          type="button"
                          onClick={() => repairDay(repairable[0])}
                          className="tap focusring rounded-xl border border-line px-3.5 py-2 text-[12.5px] font-medium text-muted"
                        >
                          Use shield now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="shell mt-3 md:col-start-1 md:mx-0 md:max-w-none md:px-0">
            <div className="card overflow-hidden">
              <div className="flex h-9 items-center justify-between gap-2 border-b border-line px-4">
                <span className="truncate text-[10.5px] font-medium uppercase tracking-[0.13em] text-faint">
                  Today · Week {week.n} {week.theme}
                </span>
                {doneToday ? (
                  <span className="flex items-center gap-1 rounded-full bg-mint/15 px-2 py-0.5 text-[10px] font-medium text-mint">
                    <CheckIcon className="h-3 w-3" /> Submitted
                  </span>
                ) : (
                  <span className="flex h-4 items-center gap-1 whitespace-nowrap text-[10.5px] text-gold">
                    <ClockIcon className="h-3.5 w-3.5 shrink-0" />
                    {countdown}
                  </span>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[11px] text-ember">
                    DAY {String(persona.currentDay).padStart(2, "0")}
                  </span>
                  <span className="text-[11px] text-faint">
                    {today?.difficulty} · ~{today?.minutes} min · {today?.xp} XP
                  </span>
                </div>
                <h2 className="mt-1.5 text-[19px] font-semibold leading-snug tracking-tight">
                  {today?.title}
                </h2>
                <p className="mt-1.5 line-clamp-2 min-h-[38px] text-[13px] leading-relaxed text-muted">
                  {today?.focus}
                </p>

                <Link
                  href={`/day/${persona.currentDay}`}
                  className={`tap focusring mt-4 flex items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-semibold ${
                    doneToday
                      ? "border border-line bg-surface-2 text-fg"
                      : "ember-fill text-white cta-shadow"
                  }`}
                >
                  {doneToday ? "Review today's submission" : `Start Day ${persona.currentDay}`}
                  <ArrowIcon className="h-[18px] w-[18px]" />
                </Link>

                {!doneToday && (
                  <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-faint">
                    <span className="flex items-center gap-1.5">
                      <GitHubIcon className="h-3.5 w-3.5" /> commit
                    </span>
                    <span className="flex items-center gap-1.5">
                      <LinkedInIcon className="h-3.5 w-3.5" /> post
                    </span>
                    <span>= day complete</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="shell mt-3 grid grid-cols-2 gap-2.5 md:col-start-1 md:mx-0 md:max-w-none md:px-0">
            <MetricCard
              label="Completion"
              value={`${completion}%`}
              sub={`${cohort.totalDays - allDone.length} days remain`}
            />
            <MetricCard label="XP earned" value={formatCount(xp)} sub={`Week ${week.n} of 9`} />
            <MetricCard
              label="Best streak"
              value={`${best}`}
              sub={best === 0 ? "Set it tonight" : `Current ${streak}`}
            />
            <MetricCard
              label="Shields"
              value={`${shieldsLeft}`}
              sub={shieldsLeft > 0 ? "Repairs one missed day" : `Next at Day 15`}
            />
          </section>

          <div className="shell mt-3 md:col-start-1 md:mx-0 md:max-w-none md:px-0">
            <StreakCalendar
              currentDay={persona.currentDay}
              completed={completed}
              repaired={repairedDays}
              missed={persona.missedDays}
              totalDays={cohort.totalDays}
            />
          </div>
        </div>

        <div className="md:col-start-2 md:row-start-1 md:space-y-3">
          <section id="standing" className="shell mt-3 scroll-mt-4 md:mx-0 md:mt-4 md:max-w-none md:px-0">
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-[15px] font-semibold">
                  <TrophyIcon className="h-4 w-4 text-gold" /> Your standing
                </h2>
                {persona.rank && (
                  <span
                    className={`text-[11px] font-medium ${
                      persona.rank.movement >= 0 ? "text-mint" : "text-rose"
                    }`}
                  >
                    {persona.rank.movement >= 0 ? "▲" : "▼"} {Math.abs(persona.rank.movement)} this week
                  </span>
                )}
              </div>

              {persona.rank ? (
                <>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-[26px] font-semibold leading-none tracking-tight">
                      {ordinal(persona.rank.position)}
                    </span>
                    <span className="text-[12px] text-faint">
                      of {formatCount(persona.rank.of)} · top {persona.rank.percentile}%
                    </span>
                  </div>
                  <ul className="mt-3.5 divide-y divide-line rounded-xl border border-line">
                    {board.map((p) => (
                      <li
                        key={p.name}
                        className={`flex items-center gap-3 px-3 py-2.5 ${
                          p.isYou ? "bg-ember/[0.08]" : ""
                        }`}
                      >
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-surface-2 font-mono text-[10px] text-faint">
                          {p.isYou ? "•" : ""}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[12.5px] font-medium">
                            {p.isYou ? "You" : p.name}
                          </span>
                          <span className="block truncate text-[10.5px] text-faint">
                            {p.college || "Profile incomplete"}
                          </span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block text-[12px] font-medium">{formatCount(p.xp)} XP</span>
                          <span className="block text-[10px] text-faint">{p.streak}d streak</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="mt-3 text-[13px] leading-relaxed text-muted">
                  You get a rank after your first submission. Everyone starts unranked — including
                  the person currently at the top.
                </p>
              )}
            </div>
          </section>

          <section className="shell mt-3 md:mx-0 md:max-w-none md:px-0">
            <div className="card p-4">
              <h2 className="text-[15px] font-semibold">Achievements</h2>
              {persona.badges.length > 0 ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {persona.badges.map((b) => (
                    <div key={b.id} className="rounded-xl border border-line bg-surface-2 p-2.5">
                      <div className="text-[12.5px] font-medium leading-snug">{b.name}</div>
                      <div className="mt-0.5 text-[10.5px] leading-tight text-faint">
                        Day {b.earnedOnDay}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 rounded-xl border border-dashed border-line-2 p-4 text-center">
                  <p className="text-[12.5px] leading-relaxed text-muted">
                    No badges yet. Your first one, <strong className="text-fg">First Commit</strong>,
                    unlocks the moment you submit today.
                  </p>
                </div>
              )}
              <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-line bg-surface-2 px-3 py-2.5">
                <SparkIcon className="h-4 w-4 shrink-0 text-gold" />
                <span className="text-[11.5px] leading-snug text-muted">
                  Next: <strong className="text-fg">{persona.nextBadge.name}</strong> ·{" "}
                  {persona.nextBadge.note}
                </span>
              </div>
            </div>
          </section>

          {profileMissing.length > 0 && (
            <section id="profile" className="shell mt-3 scroll-mt-4 md:mx-0 md:max-w-none md:px-0">
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-[15px] font-semibold">Recruiter readiness</h2>
                  <span className="text-[12px] font-medium text-gold">{profileScore}%</span>
                </div>
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-line-2">
                  <div className="h-full rounded-full ember-fill" style={{ width: `${profileScore}%` }} />
                </div>
                <p className="mt-2.5 text-[12px] leading-relaxed text-muted">
                  Your work is only findable if your profile is. Missing:{" "}
                  {profileMissing.join(", ")}.
                </p>
                <button
                  type="button"
                  className="tap focusring mt-3 w-full rounded-xl border border-line bg-surface-2 py-2.5 text-[12.5px] font-medium"
                >
                  Complete profile ({profileMissing.length} left)
                </button>
              </div>
            </section>
          )}

          <section className="shell mt-3 md:mx-0 md:max-w-none md:px-0">
            <div className="card p-4">
              <h2 className="text-[15px] font-semibold">Recent proof</h2>
              {persona.recentSubmissions.length > 0 ? (
                <ul className="mt-3 space-y-2.5">
                  {persona.recentSubmissions.map((s) => (
                    <li key={s.day} className="flex items-center gap-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-2 font-mono text-[10.5px] text-muted">
                        {s.day}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-mono text-[11.5px] text-muted">
                          {s.repo}
                        </span>
                        <span className="block text-[10.5px] text-faint">
                          {new Date(s.at).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      </span>
                      <span className="flex shrink-0 gap-1.5 text-faint">
                        <GitHubIcon className="h-4 w-4" />
                        <LinkedInIcon className="h-4 w-4" />
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
                  Nothing submitted yet. Your first proof appears here tonight.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>

      <TabBar />
    </div>
  );
}
