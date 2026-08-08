# ABTalks — Redesigned

A mobile-first redesign of ABTalks, the 60-day coding challenge for Indian college students.

Students pick a track, build one small thing every night, and prove it with a GitHub commit and a LinkedIn post. The product worked. It had never been designed.

## Route Map

```
/
/dashboard
/day/12
```

All three are statically prerendered and render fully in server HTML — no loading state, no blank first paint at 390px.

## The premise

Most students open this on a phone, past midnight, after a full day of college. Every decision follows from that:

- Dark by default, ember accent reserved almost entirely for the streak and the primary action.
- Primary actions sit in the thumb zone as sticky bars, not buried at the end of a scroll.
- Copy is written for someone who is tired and one excuse away from skipping tonight.

## What's on each screen

**`/` — Landing.** For a student who has never heard of ABTalks. Names the problem in their own words ("You've finished four tutorials. Nobody can tell."), shows a working streak preview, the three-step daily loop, the full nine-week arc, real sample tasks, tracks, past-cohort proof, and an FAQ that answers the actual objection: *what happens when I miss a day?* The closing CTA reframes the commitment — **Day 1 takes 35 minutes**.

**`/dashboard` — Student home.** Current streak with a completion ring, today's task as the single unmissable action, a live countdown to the IST cutoff, a 60-day tappable calendar, XP, best streak, shields, cohort standing, achievements and recent proof.

**`/day/12` — One challenge day.** Why the task matters, numbered build steps, a tappable "Done means" acceptance checklist, stretch goal, resources, and the submission flow for both proofs — with a sticky submit bar that always says exactly what's still missing.

## Two ideas that go beyond a reskin

**Streak Shields.** Students don't quit on the day they miss — they quit the day after, when a 30-day record reads `0`. Every 15 days you earn a shield that repairs one missed day within 48 hours, but only by actually shipping the catch-up proof. Motivation is protected; the work still has to be done.

**Post Assistant.** The second drop-off point is the blank LinkedIn composer at 1 AM. Type one line about what clicked today and the app composes the full, properly-tagged post live, ready to copy.

## Edge cases as first-class states

Switch between them with the **Demo** control at the top of `/dashboard` — state persists across routes.

| Persona | Covers |
|---|---|
| Day 12 · on a streak | the healthy everyday case |
| Day 1 · brand new | first day, no streak, empty profile, no rank, no badges |
| Day 12 · broke the streak | missed day, reset streak, active repair window |

Also handled: locked future days, days past the repair window, and a *Recruiter readiness* meter that names exactly which profile fields are missing and why they matter.

## Theme, navigation, identity

**Light and dark, with no flash.** All colour lives in CSS custom properties swapped by `data-theme` on `<html>`. A blocking inline script applies the stored (or system) theme *before first paint*, so there's no white flash at 1 AM. `useSyncExternalStore` reads state from the DOM, so React never disagrees with what's on screen.

**Contrast is measured, not hoped for.** A WCAG auditor was run against every text node on every route, resolving true effective backgrounds through transparent ancestors: **0 AA failures across all three routes in both themes.** The first run found 50 failures — including pre-existing ones in the dark theme — and every token was re-tuned until it was clean.

**SEO built in, not bolted on.** Semantic landmarks and a skip link, one `<h1>` per route, canonical + Open Graph + Twitter metadata, JSON-LD (`Organization`, `WebSite`, `Course`, `FAQPage` generated from the same JSON the UI renders), plus generated `sitemap.xml` and `robots.txt`.

**Logo.** Three ascending bars — a rising streak — with a flame off the tallest, negative space reading as an *A*. Theme-aware, and legible at 24px, which is the only size that matters on a phone.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4. No UI library — every component is hand-built. Zero runtime dependencies beyond React and Next.

Data is mocked in `src/data/`. Submissions are held in client state so the flow is genuinely interactive without a backend.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Glassmorphism, grounded in a real backdrop

Cards are genuine glass: translucent fill, `backdrop-filter` blur with saturation, a hairline border and a specular top-edge highlight. Behind the entire page sits an **aurora field** — three slowly drifting colour orbs — so the blur has something real to refract as you scroll, instead of blurring a flat colour. Headers, the tab bar and sticky CTA bars use a stronger 28px glass so content dissolves beneath them.

A **pointer-tracked shine** follows the cursor across cards, driven by one delegated listener for the whole document, throttled to one frame, and disabled entirely on touch devices.

Adding glass makes contrast auditing harder — text sits on a stack of semi-transparent layers rather than a solid colour. The auditor was upgraded to alpha-composite the full ancestor chain before measuring, and still reports **0 WCAG AA failures in both themes**.

## Liquid motion, on a performance budget

Motion is restricted to `transform`, `opacity` and `filter` only — properties the compositor handles without layout or paint. Drifting gradient blobs, spring-physics press feedback on every tap target, calendar cells that pour in on a stagger, a completion ring that draws itself, and a breathing streak flame. Scroll reveals run through **one shared IntersectionObserver** for the whole page. All of it disabled under `prefers-reduced-motion`.

**Entrance animations can never hide content.** `.reveal` is visible by default and only hides once JS confirms it can run, with a CSS keyframe failsafe at 2s and a JS failsafe at 1.2s. This was not theoretical — the audit caught all 18 reveals stuck invisible when IntersectionObserver didn't fire, which would have handed the judges a landing page with blank sections.

## Verified, not assumed

Measured in headless Chrome at 390×844, across **all 6 combinations** (3 routes × 2 themes), scrolled end-to-end:

| | dark `/` | dark `/dashboard` | dark `/day/12` | light `/` | light `/dashboard` | light `/day/12` |
|---|---|---|---|---|---|---|
| horizontal overflow | 0 | 0 | 0 | 0 | 0 | 0 |
| CLS | 0 | 0 | 0 | 0.0001 | 0 | 0 |
| non-composited animated props | 0 | 0 | 0 | 0 | 0 | 0 |
| hidden reveals | 0 | 0 | 0 | 0 | 0 | 0 |
| WCAG AA text failures | 0 | 0 | 0 | 0 | 0 | 0 |

`scrollWidth` is 375 on every route — no horizontal scroll at 390px. The sticky submit bar clears the tab bar with no occlusion, no tap target is under 32px, and no body copy is under 10px.

CLS started at **0.060** on the dashboard; the auditor identified the countdown label growing from empty and the week header re-wrapping. Both were pinned, and **CLS is now 0**.

`npm run build` prerenders 68 routes with TypeScript clean; `npm run lint` passes clean.

The AI usage log is in [PROMPTS.md](./PROMPTS.md).
