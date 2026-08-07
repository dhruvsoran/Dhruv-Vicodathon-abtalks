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

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4. No UI library — every component is hand-built. Zero runtime dependencies beyond React and Next.

Data is mocked in `src/data/`. Submissions are held in client state so the flow is genuinely interactive without a backend.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Verified, not assumed

Measured in headless Chrome at 390×844:

- `scrollWidth: 375` on all three routes — zero horizontal overflow.
- Sticky submit bar clears the tab bar with no occlusion.
- No tap target under 32px, no body copy under 10px.
- `npm run build` prerenders 65 routes, TypeScript clean; `npm run lint` passes clean.

The AI usage log is in [PROMPTS.md](./PROMPTS.md).
