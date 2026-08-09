"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertIcon,
  ArrowIcon,
  CheckIcon,
  ChevronIcon,
  ClockIcon,
  CopyIcon,
  GitHubIcon,
  LinkedInIcon,
  ShieldIcon,
  SparkIcon,
} from "@/components/icons";
import TabBar from "@/components/tab-bar";
import { ThemeToggle } from "@/components/theme";
import { usePersona } from "@/components/persona-store";
import { draftPost, weekOf } from "@/lib/challenge";
import type { ChallengeDay, DayDetail } from "@/lib/types";

const repoPattern = /^(https:\/\/github\.com\/|github\.com\/)[\w.-]+\/[\w.-]+/i;
const postPattern = /linkedin\.com\/(posts|feed|in)\//i;

function Field({
  label,
  hint,
  icon,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  inputMode,
}: {
  label: string;
  hint: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  placeholder: string;
  inputMode?: "url";
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="flex items-center gap-2 text-[13px] font-medium">
        <span className="text-muted">{icon}</span>
        {label}
      </label>
      <input
        id={id}
        type="url"
        inputMode={inputMode}
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : `${id}-hint`}
        className={`focusring mt-2 w-full rounded-xl border bg-ink-2 px-3.5 py-3 font-mono text-[13px] text-fg placeholder:text-faint ${
          error ? "border-rose" : "border-line"
        }`}
      />
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-rose">
          <AlertIcon className="h-3.5 w-3.5" />
          {error}
        </p>
      ) : (
        <p id={`${id}-hint`} className="mt-1.5 text-[11.5px] text-faint">
          {hint}
        </p>
      )}
    </div>
  );
}

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="tap focusring flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <span className="text-[14px] font-semibold">{title}</span>
        <ChevronIcon
          className={`h-4 w-4 shrink-0 text-faint transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>
      {open && <div className="border-t border-line px-4 py-3.5">{children}</div>}
    </div>
  );
}

export default function DayView({ day, detail }: { day: ChallengeDay; detail: DayDetail }) {
  const { persona, isDone, submitDay, submissions, repairedDays, shieldsLeft, ready } =
    usePersona();

  const [repo, setRepo] = useState("");
  const [post, setPost] = useState("");
  const [learned, setLearned] = useState("");
  const [touched, setTouched] = useState({ repo: false, post: false });
  const [checks, setChecks] = useState<boolean[]>(() => detail.acceptance.map(() => false));
  const [copied, setCopied] = useState(false);
  const [showDraft, setShowDraft] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const week = weekOf(day.day);
  const done = isDone(day.day);
  const existing = submissions[day.day];
  const isToday = day.day === persona.currentDay;
  const isLocked = day.day > persona.currentDay;
  const wasMissed = persona.missedDays.includes(day.day) && !repairedDays.includes(day.day);
  const isRepairMode = wasMissed && shieldsLeft > 0;

  const repoError =
    touched.repo && repo.trim() && !repoPattern.test(repo.trim())
      ? "Use a link like github.com/you/your-repo"
      : undefined;
  const postError =
    touched.post && post.trim() && !postPattern.test(post.trim())
      ? "That doesn't look like a LinkedIn post URL"
      : undefined;

  const repoValid = repoPattern.test(repo.trim());
  const postValid = postPattern.test(post.trim());
  const doneCount = checks.filter(Boolean).length;
  const checklistComplete = checks.length > 0 && checks.every(Boolean);
  const checklistPct = checks.length ? Math.round((doneCount / checks.length) * 100) : 0;
  const canSubmit = repoValid && postValid && checklistComplete;

  const draft = useMemo(
    () =>
      draftPost({
        day: day.day,
        title: day.title,
        name: persona.student.name,
        learned,
        repo: repo.trim(),
        track: persona.student.track,
      }),
    [day.day, day.title, persona.student.name, persona.student.track, learned, repo],
  );

  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setTouched({ repo: true, post: true });
      return;
    }
    submitDay(day.day, { repo: repo.trim(), post: post.trim(), note: learned });
    setJustSubmitted(true);
  };

  if (!ready) return <div className="min-h-screen bg-ink" />;

  return (
    <div className="pb-28 md:pb-12">
      <header className="sticky top-0 z-40 border-b border-line glass-strong">
        <div className="shell flex h-14 items-center justify-between gap-3">
          <Link
            href="/dashboard"
            className="tap focusring flex items-center gap-1.5 text-[13px] text-muted"
          >
            <ChevronIcon className="h-4 w-4 rotate-180" />
            Dashboard
          </Link>
          <div className="flex items-center gap-1.5">
            <ThemeToggle className="mr-0.5 h-8 w-8" />
            {day.day > 1 && (
              <Link
                href={`/day/${day.day - 1}`}
                aria-label={`Day ${day.day - 1}`}
                className="tap focusring grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface text-muted"
              >
                <ChevronIcon className="h-3.5 w-3.5 rotate-180" />
              </Link>
            )}
            <span className="rounded-lg border border-line bg-surface px-2.5 py-1 font-mono text-[11px] text-muted">
              {day.day}/60
            </span>
            {day.day < 60 && (
              <Link
                href={`/day/${day.day + 1}`}
                aria-label={`Day ${day.day + 1}`}
                className={`tap focusring grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface ${
                  day.day + 1 > persona.currentDay ? "text-faint/50" : "text-muted"
                }`}
              >
                <ChevronIcon className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
        {/* Where this day sits in the 60-day arc. Static width → no CLS. */}
        <div aria-hidden="true" className="h-1 w-full bg-line-2/40">
          <div
            className="h-full ember-fill"
            style={{ width: `${Math.round((day.day / 60) * 100)}%` }}
          />
        </div>
      </header>

      <main id="main" className="md:shell md:grid md:grid-cols-[1fr_400px] md:items-start md:gap-7">
        <div className="md:min-w-0">
          <section className="shell pt-5 md:mx-0 md:max-w-none md:px-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-ember/15 px-2 py-1 font-mono text-[10.5px] font-medium tracking-[0.08em] text-ember">
                DAY {String(day.day).padStart(2, "0")}
              </span>
              <span className="rounded-md border border-line bg-surface px-2 py-1 text-[10.5px] text-muted">
                Week {week.n} · {week.theme}
              </span>
              <span className="rounded-md border border-line bg-surface px-2 py-1 text-[10.5px] text-muted">
                {day.tag}
              </span>
            </div>

            <h1 className="mt-3.5 text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] md:text-[38px]">
              {day.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[11.5px] text-faint">
              <span className="flex items-center gap-1.5">
                <ClockIcon className="h-3.5 w-3.5" /> ~{day.minutes} min
              </span>
              <span>{day.difficulty}</span>
              <span className="text-gold">+{day.xp} XP</span>
              {isToday && !done && (
                <span className="rounded-full bg-gold/15 px-2 py-0.5 font-medium text-gold">
                  Due 11:59 PM IST
                </span>
              )}
            </div>
          </section>

          {isLocked && (
            <section className="shell mt-4 md:mx-0 md:max-w-none md:px-0">
              <div className="card border-line-2 bg-surface-2 p-4">
                <h2 className="text-[13.5px] font-semibold">Not unlocked yet</h2>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
                  You&apos;re on Day {persona.currentDay}. This one opens in{" "}
                  {day.day - persona.currentDay} day
                  {day.day - persona.currentDay === 1 ? "" : "s"}. You can read it, but the streak is
                  built one night at a time.
                </p>
                <Link
                  href={`/day/${persona.currentDay}`}
                  className="tap focusring mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ember"
                >
                  Go to Day {persona.currentDay} <ArrowIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            </section>
          )}

          {wasMissed && (
            <section className="shell mt-4 md:mx-0 md:max-w-none md:px-0">
              <div className="card border-gold/40 bg-gold/[0.06] p-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold">
                    <ShieldIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-[13.5px] font-semibold">
                      {isRepairMode ? "You can still repair this day" : "This day was missed"}
                    </h2>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
                      {isRepairMode
                        ? "Submit both proofs within 48 hours of the miss and your streak reconnects. One shield will be spent."
                        : "The 48-hour repair window has passed. It stays on your record, and that's honest. Keep going from today."}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="shell mt-4 space-y-3 md:mx-0 md:max-w-none md:px-0">
            <div className="card p-4">
              <h2 className="flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-[0.13em] text-gold">
                <SparkIcon className="h-3.5 w-3.5" />
                Why this matters
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-fg/90">{detail.why}</p>
            </div>

            <div className="card p-4">
              <h2 className="text-[15px] font-semibold">What to build</h2>
              <p className="mt-1 text-[11.5px] text-faint">
                Follow in order. Each step is sized to finish tonight.
              </p>
              <ol className="mt-4">
                {detail.build.map((step, i) => (
                  <li key={step} className="relative flex gap-3.5 pb-4 last:pb-0">
                    {i < detail.build.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute left-[15px] top-9 bottom-0 w-px bg-line-2"
                      />
                    )}
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ember/12 font-mono text-[12px] font-semibold text-ember">
                      {i + 1}
                    </span>
                    <span className="pt-1.5 text-[13.5px] leading-relaxed text-muted">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div
              className={`card p-4 transition-colors ${
                checklistComplete ? "border-mint/40" : ""
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h2 className="text-[15px] font-semibold">Done means</h2>
                <span className="tnum text-[11px] text-faint">
                  {doneCount}/{checks.length}
                </span>
              </div>
              <div
                aria-hidden="true"
                className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-line-2/40"
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    checklistComplete ? "bg-mint" : "ember-fill"
                  }`}
                  style={{ width: `${checklistPct}%` }}
                />
              </div>
              {checklistComplete && (
                <p className="slidein mt-2.5 flex items-center gap-1.5 text-[11.5px] font-medium text-mint">
                  <CheckIcon className="h-3.5 w-3.5" /> All checks passed — ready to submit.
                </p>
              )}
              <ul className="mt-3 space-y-2">
                {detail.acceptance.map((item, i) => (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() =>
                        setChecks((c) => c.map((v, idx) => (idx === i ? !v : v)))
                      }
                      aria-pressed={checks[i]}
                      className="tap focusring press flex w-full items-start gap-3 rounded-xl border border-line bg-surface-2 p-3 text-left"
                    >
                      <span
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-all duration-300 ${
                          checks[i]
                            ? "scale-105 border-mint bg-mint text-onbright"
                            : "border-line-2 text-transparent"
                        }`}
                      >
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      <span
                        className={`text-[13px] leading-relaxed ${
                          checks[i] ? "text-faint line-through" : "text-muted"
                        }`}
                      >
                        {item}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <Accordion title="Stretch goal (optional)">
              <p className="text-[13px] leading-relaxed text-muted">{detail.stretch}</p>
            </Accordion>

            {detail.resources.length > 0 && (
              <Accordion title="If you get stuck">
                <ul className="space-y-2">
                  {detail.resources.map((r) => (
                    <li key={r.href}>
                      <a
                        href={r.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tap focusring flex items-center justify-between gap-3 text-[13px] text-sky"
                      >
                        {r.label}
                        <ArrowIcon className="h-3.5 w-3.5 shrink-0" />
                      </a>
                    </li>
                  ))}
                </ul>
              </Accordion>
            )}
          </section>
        </div>

        <div className="md:sticky md:top-[72px]">
          <section
            id="submit"
            className="shell mt-4 scroll-mt-16 md:mx-0 md:max-w-none md:px-0"
          >
            {done || justSubmitted ? (
              <div className="card slidein border-mint/40 bg-mint/[0.06] p-4">
                <div className="flex items-center gap-2.5">
                  <span className="popin grid h-9 w-9 place-items-center rounded-full bg-mint text-onbright">
                    <CheckIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-[15px] font-semibold">Day {day.day} locked in</h2>
                    <p className="text-[11.5px] text-faint">
                      +{day.xp} XP · streak continued
                    </p>
                  </div>
                </div>

                {(existing || repo) && (
                  <div className="mt-3.5 space-y-2">
                    <div className="flex items-center gap-2.5 rounded-xl border border-line bg-surface p-3">
                      <GitHubIcon className="h-4 w-4 shrink-0 text-muted" />
                      <span className="min-w-0 truncate font-mono text-[11.5px] text-muted">
                        {existing?.repo || repo}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-xl border border-line bg-surface p-3">
                      <LinkedInIcon className="h-4 w-4 shrink-0 text-muted" />
                      <span className="min-w-0 truncate font-mono text-[11.5px] text-muted">
                        {existing?.post || post}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-3.5 flex gap-2">
                  {day.day < 60 && (
                    <Link
                      href={`/day/${day.day + 1}`}
                      className="tap focusring flex-1 rounded-xl border border-line bg-surface py-2.5 text-center text-[12.5px] font-medium"
                    >
                      Preview Day {day.day + 1}
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    className="tap focusring flex-1 rounded-xl bg-mint py-2.5 text-center text-[12.5px] font-semibold text-onbright"
                  >
                    Back to dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="card p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-[15px] font-semibold">Submit your proof</h2>
                    <p className="mt-0.5 text-[11.5px] text-faint">
                      {checklistComplete
                        ? "Both links required, then you're done."
                        : "Finish the checklist first — links unlock below."}
                    </p>
                  </div>
                  <span
                    className={`flex h-6 items-center gap-1 rounded-full px-2.5 text-[10px] font-semibold ${
                      checklistComplete
                        ? "bg-mint/15 text-mint"
                        : "bg-surface-2 text-faint"
                    }`}
                  >
                    {checklistComplete ? (
                      <>
                        <CheckIcon className="h-3 w-3" /> Ready
                      </>
                    ) : (
                      `${doneCount}/${checks.length}`
                    )}
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  <Field
                    label="GitHub repo or commit"
                    hint="Public repository. A direct commit link works too."
                    icon={<GitHubIcon className="h-4 w-4" />}
                    value={repo}
                    onChange={setRepo}
                    onBlur={() => setTouched((t) => ({ ...t, repo: true }))}
                    error={repoError}
                    placeholder="github.com/you/day-12-calendar"
                    inputMode="url"
                  />

                  <div className="rounded-xl border border-line bg-surface-2 p-3.5">
                    <div className="flex items-center gap-2">
                      <SparkIcon className="h-4 w-4 text-gold" />
                      <span className="text-[12.5px] font-semibold">Post assistant</span>
                    </div>
                    <p className="mt-1.5 text-[11.5px] leading-relaxed text-faint">
                      Blank page at midnight, solved. One line in, a full post out.
                    </p>
                    <label htmlFor="learned" className="sr-only">
                      What did you learn today
                    </label>
                    <textarea
                      id="learned"
                      rows={2}
                      value={learned}
                      onChange={(e) => setLearned(e.target.value)}
                      placeholder="One thing that clicked today…"
                      className="focusring mt-2.5 w-full resize-none rounded-lg border border-line bg-ink-2 px-3 py-2.5 text-[13px] text-fg placeholder:text-faint"
                    />

                    <button
                      type="button"
                      onClick={() => setShowDraft((v) => !v)}
                      aria-expanded={showDraft}
                      className="tap focusring mt-2.5 flex w-full items-center justify-between gap-2 text-[11.5px] font-medium text-muted"
                    >
                      {showDraft ? "Hide draft" : "Preview draft post"}
                      <ChevronIcon
                        className={`h-3.5 w-3.5 transition-transform duration-300 ${showDraft ? "rotate-90" : ""}`}
                      />
                    </button>

                    {showDraft && (
                      <pre className="slidein mt-2 max-h-36 overflow-y-auto whitespace-pre-wrap rounded-lg border border-line bg-ink px-3 py-2.5 font-sans text-[11.5px] leading-relaxed text-muted">
                        {draft}
                      </pre>
                    )}

                    <button
                      type="button"
                      onClick={copyDraft}
                      className="tap focusring press mt-2.5 flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-surface py-2.5 text-[12.5px] font-medium"
                    >
                      {copied ? (
                        <>
                          <CheckIcon className="popin h-4 w-4 text-mint" /> Copied
                        </>
                      ) : (
                        <>
                          <CopyIcon className="h-4 w-4" /> Copy draft post
                        </>
                      )}
                    </button>
                  </div>

                  <Field
                    label="LinkedIn post"
                    hint="Paste the URL after you publish."
                    icon={<LinkedInIcon className="h-4 w-4" />}
                    value={post}
                    onChange={setPost}
                    onBlur={() => setTouched((t) => ({ ...t, post: true }))}
                    error={postError}
                    placeholder="linkedin.com/posts/your-post"
                    inputMode="url"
                  />
                </div>

                <div className="mt-4 hidden md:block">
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={`tap focusring w-full rounded-2xl py-3.5 text-[15px] font-semibold transition-opacity ${
                      canSubmit
                        ? "ember-fill sheen text-white"
                        : "cursor-not-allowed border border-line bg-surface-2 text-faint"
                    }`}
                  >
                    {isRepairMode ? "Repair with shield" : `Complete Day ${day.day}`}
                  </button>
                  {!checklistComplete && (
                    <p className="mt-2 text-center text-[11px] text-faint">
                      Tick every item under &ldquo;Done means&rdquo; to unlock.
                    </p>
                  )}
                </div>

                <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line glass-strong px-5 pb-[max(64px,calc(env(safe-area-inset-bottom)+60px))] pt-3 md:hidden">
                  <div className="mx-auto max-w-[440px]">
                    {!canSubmit && (touched.repo || touched.post || !checklistComplete) && (
                      <p className="mb-2 text-center text-[11px] text-faint">
                        {!checklistComplete
                          ? `Done means: ${doneCount}/${checks.length} — tick the checklist to unlock`
                          : !repoValid && !postValid
                            ? "Add both links to complete the day"
                            : !repoValid
                              ? "GitHub link still needed"
                              : "LinkedIn link still needed"}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className={`tap focusring press w-full rounded-2xl py-3.5 text-[15px] font-semibold ${
                        canSubmit
                          ? "ember-fill sheen text-white cta-shadow"
                          : "cursor-not-allowed border border-line bg-surface-2 text-faint"
                      }`}
                    >
                      {isRepairMode ? "Repair with shield" : `Complete Day ${day.day}`}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </section>
        </div>
      </main>

      <TabBar />
    </div>
  );
}
