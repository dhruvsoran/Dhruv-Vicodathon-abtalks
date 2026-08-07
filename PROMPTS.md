# AI Usage Log — ABTalks Redesign

This project was built end-to-end in an AI-assisted (vibe-coded) session using **opencode** with the **LongCat** model. This log records the actual prompts, the reasoning behind each decision, and the verification steps taken.

---

## Session 1 — Framing the problem

**Prompt (verbatim, from the hackathon brief):**

> I am participating in a hackathon and this is the problem statement I am working on: *Redesign ABTalks* — a 60-day coding challenge for Indian college students. Students pick a track, build something every day, and maintain a public learning streak by submitting a GitHub commit and a LinkedIn post. Most students use the platform on their phones, late at night after college. The product works. It has never been designed.
>
> Ship at minimum three screens: Landing Page (`/`), Student Dashboard (`/dashboard`), Challenge Day (`/day/12`). Mobile-first at 390px. Handle real-world edge cases: first day with no streak, a missed day, an empty profile. Introduce at least one thoughtful idea that improves the student experience. Auth, real accounts and a production database are out of scope — use mocked data.

**AI clarifying questions asked before writing code:**

1. Which stack? → chose **Next.js 16 (App Router) + Tailwind v4 + TypeScript**, because static prerendering of all 60 day routes means the judges' screenshot bot never hits a loading state.
2. Full build now, or design plan first? → **full build**.

**Key reasoning captured in this step:**

- The judging bot opens each route at **390px** and screenshots it. Anything gated behind `useEffect` renders blank in that window. This constraint drove an early architectural rule: *every route must be meaningful in its server-rendered HTML.*
- "Late at night after college" is the single most important line in the brief. It implies: dark UI by default, thumb-reachable primary actions, low-friction input, and empathy for the student who is tired and about to skip a day.

---

## Session 2 — Design direction

**Prompt:**

> Define a visual language for a product whose core emotional object is a *streak*. It should feel like a serious engineering tool, not a gamified kids' app, but the streak still needs to feel warm and worth protecting.

**Result — the token system in `src/app/globals.css`:**

- Near-black canvas (`--color-ink: #08080a`) with layered surfaces, so the interface is comfortable at midnight on an OLED phone.
- A single accent: **ember orange → gold** (`--color-ember`, `--color-gold`). The streak is fire, so the accent gradient is used almost exclusively for streak and primary action. Restraint here is what makes it read as a tool rather than a toy.
- Semantic status colours (`mint` shipped, `rose` missed, `gold` at-risk/today) used consistently across the calendar, badges and submission states.
- A `.shell` utility caps mobile content at 480px and expands to 1080px on desktop, so mobile-first layout upgrades to two columns without a rewrite.

---

## Session 3 — Mock data that feels real

**Prompt:**

> Generate a realistic 60-day full-stack curriculum for Indian college students, sized for 45–75 minutes a night after class. Nine weekly themes with an arc from "create your first public repo" to "portfolio arranged for recruiters". Then generate three student personas that exercise the edge cases in the brief.

**Produced:**

- `src/data/challenge.json` — the cohort, 9 week themes, all **60 days** (title, focus, difficulty, minutes, XP, tag), plus long-form detail (why / build steps / acceptance criteria / stretch / resources) for featured days.
- `src/data/students.json` — three personas mapped directly to the brief's required edge cases:

  | Persona | Edge case from the brief |
  |---|---|
  | `streak` — Ananya, Day 12, 11-day streak | the healthy everyday case |
  | `fresh` — Rohan, Day 1 | **first day with no streak + an empty profile** |
  | `missed` — Meera, Day 12, missed Day 10 | **a missed day / broken streak** |

- A `getDetail()` fallback in `src/lib/challenge.ts` synthesises sensible content for any of the 60 days that lacks hand-written detail, so **no route is ever empty**.

---

## Session 4 — The differentiating idea

**Prompt:**

> The brief asks for at least one thoughtful idea that genuinely improves the student experience. Don't add a feature for novelty. Identify where students actually drop out of a 60-day challenge and design for that exact moment.

**AI analysis:** Students don't quit on the day they miss. They quit the day *after*, when a 30-day record shows `0` and the effort feels erased. The second failure point is the LinkedIn post — a tired student will push the commit and then abandon the day at the blank post composer.

**Two ideas shipped:**

1. **Streak Shields** (`repairDay`, shield state in `persona-store.tsx`; UI on both `/dashboard` and `/day/[day]`). One shield every 15 days repairs a missed day within 48 hours — but only by *actually shipping the catch-up proof*. It protects motivation without letting anyone skip the work. The dashboard surfaces it as a time-boxed, actionable card rather than a silent setting.
2. **Post Assistant** (`draftPost()` in `src/lib/challenge.ts`, UI in `day-view.tsx`). The student types one line about what clicked today; the app composes a complete, properly-tagged LinkedIn post live and copies it. This removes the blank-page problem at the exact minute it kills the streak.

---

## Session 5 — Building the three routes

**Prompt:**

> Build the landing page for a student who has never heard of ABTalks. It must earn a 60-day commitment in one scroll: name the problem in their words, show exactly what one day costs, show the whole 60-day arc, and be honest about what happens when they slip.

Landing (`src/components/landing.tsx`) narrative order: hero with live cohort proof → a working streak preview → *"You've finished four tutorials. Nobody can tell."* → the 3-step daily loop → Streak Shields → 9-week arc → sample tasks → tracks → testimonials → outcomes → FAQ → CTA. The final CTA deliberately reframes the commitment as **"Day 1 takes 35 minutes"** rather than 60 days.

**Prompt:**

> Build the dashboard. Everything in the brief — current streak, today's task, progress, completion, standing and achievements — but the answer to "what do I do right now?" must be unmissable, and all three edge cases must be first-class states, not error messages.

Dashboard (`src/components/dashboard.tsx`) adapts its hero copy per state:

- **No streak (Day 1):** "Your streak starts tonight. Nothing here yet, and that's fine."
- **Broken streak:** "You still have N days shipped. That doesn't disappear." — deliberately counting what survived rather than what was lost.
- **Active streak:** flame, current vs. best, and a live countdown to the IST cutoff.
- **Empty profile:** a *Recruiter readiness* meter that names the missing fields and explains why they matter — "your work is only findable if your profile is."
- **No rank yet:** "Everyone starts unranked — including the person currently at the top."

**Prompt:**

> Build `/day/12` as the complete experience of one challenge day: read the task, understand what to build, submit both proofs. Validate honestly and never block a tired student with a vague error.

Day view (`src/components/day-view.tsx`): why-it-matters → numbered build steps → tappable "Done means" acceptance checklist → collapsible stretch goal and resources → submission form with per-field URL validation that only fires **on blur** (never punishing mid-typing), a sticky thumb-reachable submit bar that states exactly which link is still missing, and a success state. It also handles **locked future days** and **repairable missed days** from the same route.

---

## Session 6 — Verification (the part most submissions skip)

**Prompt:**

> The judges screenshot every route at exactly 390px. Verify programmatically — don't assume.

Because the model in use could not view images, verification was done by **measuring the live DOM in headless Chrome** rather than eyeballing screenshots:

1. Injected a harness that loads each route in a 390×844 iframe and reports `scrollWidth` plus every element whose bounding box escapes the viewport.
   - **Result:** `scrollWidth: 375` on `/`, `/dashboard`, `/day/12` — **zero horizontal overflow**. The only out-of-bounds elements were the intentional snap-scroll carousels and decorative blur orbs.
2. Measured fixed elements while scrolled to the bottom to confirm the sticky submit bar clears the tab bar.
   - **Result:** submit button `bottom: 780`, tab bar `top: 779` — correctly stacked, no occlusion.
3. Audited tap-target sizes and font sizes below 10px across all routes.
4. **Caught a real bug this way:** `/dashboard` and `/day/12` initially reported `docH: 844` with zero fixed elements — the pages were rendering *blank*, because a `ready` flag gated content behind client hydration. For a screenshot-judged submission this would have been fatal. Replaced the `useEffect` + `setState` pattern with `useSyncExternalStore`, which reads `localStorage` safely and lets the full page render server-side. Post-fix: `docH` 1979 and 2007. This also cleared a React Compiler lint error about cascading renders.

**Final checks:** `npm run build` — 65 static routes prerendered, TypeScript clean. `npm run lint` — passes with zero warnings.

---

## Honest notes on AI usage

- The **AI wrote effectively all of the code**: the design token system, all three routes, the persona store, the calendar, and both signature features.
- The **most valuable AI contributions were not code**: the decision to prerender everything because of how judging works, the diagnosis that students quit the day *after* they slip, and the DOM-measurement verification strategy that caught the blank-render bug.
- **Human-directed choices:** the stack, the scope, and the instruction to solve a real drop-off moment instead of adding a decorative feature.
- Copy was written to sound like a person talking to a tired student at midnight, not like marketing. That was an explicit and repeated instruction throughout the session.
