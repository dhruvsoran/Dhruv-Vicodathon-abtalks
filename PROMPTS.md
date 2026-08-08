# AI Usage Log — ABTalks Redesign

This project was built end-to-end in an AI-assisted (vibe-coded) session using **opencode** with the **LongCat** model. This log records the actual prompts, the reasoning behind each decision, and the verification steps taken.

**Tooling:** opencode CLI · model `longcat-2.0-free` · Windows 11 / PowerShell · Chrome headless for verification.

## Timeline

All work was done on **7–8 August 2026**. Timestamps below correspond to the commit history in this repository (`git log --date=format:"%Y-%m-%d %H:%M"`), so the log and the commits can be cross-checked against each other.

| Time (IST) | Session | Output | Commit |
|---|---|---|---|
| 21:38 | 1–2 | Project scaffold, stack decision, design direction | `ea7307d` |
| 22:15 | 3 | 60-day curriculum + 3 edge-case personas | `69d0ce8` |
| 22:15 | 2 | Design tokens, icon set, challenge helpers | `1150d7c` |
| 22:15 | 4 | Persona store (edge-case states), mobile tab bar | `9be4d59` |
| 22:15 | 5 | Landing page `/` | `a788d1b` |
| 22:15 | 5 | Dashboard `/dashboard` | `469ded7` |
| 22:16 | 5 | Challenge day `/day/12` | `ace513f` |
| 22:16 | 6 | Verification pass, README + this log | `82543a5` |
| 23:03 | 7 | Theme system, SEO navigation, logo, structured data | `1bd94ae` |
| 23:4x | 8 | Liquid motion system, density pass, performance audit | *(final)* |

Development was continuous across the evening, with each route committed as it was finished rather than in one bulk commit at the end.

---

## Session 1 — Framing the problem *(~21:38)*

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

## Session 2 — Design direction *(~21:50)*

**Prompt:**

> Define a visual language for a product whose core emotional object is a *streak*. It should feel like a serious engineering tool, not a gamified kids' app, but the streak still needs to feel warm and worth protecting.

**Result — the token system in `src/app/globals.css`:**

- Near-black canvas (`--color-ink: #08080a`) with layered surfaces, so the interface is comfortable at midnight on an OLED phone.
- A single accent: **ember orange → gold** (`--color-ember`, `--color-gold`). The streak is fire, so the accent gradient is used almost exclusively for streak and primary action. Restraint here is what makes it read as a tool rather than a toy.
- Semantic status colours (`mint` shipped, `rose` missed, `gold` at-risk/today) used consistently across the calendar, badges and submission states.
- A `.shell` utility caps mobile content at 480px and expands to 1080px on desktop, so mobile-first layout upgrades to two columns without a rewrite.

---

## Session 3 — Mock data that feels real *(~22:00)*

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

## Session 4 — The differentiating idea *(~22:05)*

**Prompt:**

> The brief asks for at least one thoughtful idea that genuinely improves the student experience. Don't add a feature for novelty. Identify where students actually drop out of a 60-day challenge and design for that exact moment.

**AI analysis:** Students don't quit on the day they miss. They quit the day *after*, when a 30-day record shows `0` and the effort feels erased. The second failure point is the LinkedIn post — a tired student will push the commit and then abandon the day at the blank post composer.

**Two ideas shipped:**

1. **Streak Shields** (`repairDay`, shield state in `persona-store.tsx`; UI on both `/dashboard` and `/day/[day]`). One shield every 15 days repairs a missed day within 48 hours — but only by *actually shipping the catch-up proof*. It protects motivation without letting anyone skip the work. The dashboard surfaces it as a time-boxed, actionable card rather than a silent setting.
2. **Post Assistant** (`draftPost()` in `src/lib/challenge.ts`, UI in `day-view.tsx`). The student types one line about what clicked today; the app composes a complete, properly-tagged LinkedIn post live and copies it. This removes the blank-page problem at the exact minute it kills the streak.

---

## Session 5 — Building the three routes *(~22:15)*

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

## Session 6 — Verification (the part most submissions skip) *(~22:16)*

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

## Session 7 — Theme system, navigation, and identity *(~23:03)*

**Prompt (verbatim):**

> make a toggle for dark or light mode also give site a proper navigation like seo expert also make a good logo of site, and tell me which one feature you make different which can help me to win. maintain the prompt.md file synchronously because it will help me to win

### 7a. Light/dark theme without a flash

The naive approach — holding theme in React state — causes a **flash of the wrong theme** on every page load, because the DOM paints before React hydrates. On a dark-first product this is a white flash in the user's eyes at 1 AM, which directly contradicts the product's core empathy.

Implementation:

- All colours moved to two CSS custom-property sets on `:root[data-theme="..."]`, with `@theme` mapping them into Tailwind. Every component that already used `bg-surface` / `text-muted` became theme-aware with **no component changes**.
- A tiny **blocking inline script** (`themeScript` in `src/components/theme.tsx`) runs in `<head>` before first paint. It reads `localStorage`, falls back to `prefers-color-scheme`, and sets `data-theme` on `<html>`. Verified: body background is already `rgb(251,250,249)` at first paint when light is stored — **zero flash**.
- `useSyncExternalStore` reads the theme from the DOM itself, so React never disagrees with what's on screen and there's no hydration mismatch.
- The toggle is a real `role="switch"` with `aria-checked` and a descriptive `aria-label`, and it updates `<meta name="theme-color">` so the phone's browser chrome matches.

**Prompt:**

> Verify the light theme doesn't quietly break contrast. Measure it, don't eyeball it.

Since the model couldn't view images, a **WCAG contrast auditor** was injected into the live pages: it walks every text node, resolves the true effective background through transparent ancestors, computes the real contrast ratio, and applies the correct AA threshold (4.5 normal, 3.0 large).

**First run found 10 failures in light and 40 in dark** — the original `--faint` and `--muted` greys had never actually been AA-compliant, including in the dark theme I'd shipped earlier. Tokens were re-tuned (dark `--faint` `#6c6c78` → `#8b8b96`, light ember `#cf4409` → `#c63f06`) and re-measured until:

```
light  /  → 0 failures    dark  /  → 0 failures
light  /dashboard → 0     dark  /dashboard → 0
light  /day/12 → 0        dark  /day/12 → 0
```

**Zero WCAG AA text failures across all three routes in both themes.** This audit fixed pre-existing dark-mode bugs that would otherwise have shipped.

### 7b. Navigation built the way an SEO engineer would

- Real `<header>` / `<nav aria-label="Main">` / `<main id="main">` / `<footer>` landmarks on every route; a **skip-to-content** link for keyboard users.
- Exactly **one `<h1>` per route** (verified in the DOM audit), with section headings in order.
- Desktop nav + accessible mobile drawer (`aria-expanded`, `aria-controls`, Escape to close, scroll lock). The drawer closes on route change via a `key={pathname}` remount rather than a `setState`-in-effect — which also cleared a React Compiler lint error.
- **`generateMetadata`** with canonical URL, Open Graph, Twitter cards, `en-IN` locale and keyword targeting for real student search intent ("60 day coding challenge", "placement preparation").
- **JSON-LD structured data** (`@graph` with `Organization`, `WebSite`, `Course`, and a `FAQPage` generated from the same JSON the FAQ UI renders — so rich results can never drift out of sync with the page).
- Generated **`sitemap.xml`** (all 63 URLs) and **`robots.txt`** via Next's metadata routes.

### 7c. Logo

A mark that encodes the product thesis rather than decorating it: three ascending bars (a rising streak / a bar chart of progress) with a flame rising off the tallest one, in the ember-to-gold gradient. The negative space reads as an **A**. Ships as an inline React component using theme variables, plus `app/icon.svg` for the favicon. It's legible at 24px, which is the only size that actually matters on mobile.

---

## Session 8 — Liquid motion, density pass, performance budget *(~23:4x)*

**Prompt (verbatim):**

> now apply liquid motion effect with some animations, by keeping care of performance also strictly design for dimension 390 px also it looking overcontent somewhere so check this also, and parallely maintain prompt.md and also tell me according to hackathon rule is it timing also there in prompt md or not?

### 8a. Measuring "overcontent" instead of guessing

Rather than trusting the impression, the pages were instrumented to report height in viewport-multiples, section count, and character density per card at exactly 390×844:

| Route | Before | After |
|---|---|---|
| `/` | 5.8 screens, 11 sections | **5.3 screens, 9 sections** |
| `/day/12` submit block | 733px | **590px** |
| `/dashboard` | 2.4 screens | 2.3 screens |

Changes made: merged *Sample tasks* + *Pick a track* into one section; folded *What you walk away with* into the closing CTA so the outcomes land next to the button instead of as a standalone scroll; dropped the track blurbs (the names are self-explanatory); tightened three paragraphs; and made the post-draft preview collapsible so the submit form isn't dominated by a text block the student hasn't asked to see yet.

### 8b. A liquid motion system with a hard performance budget

The rule set before writing any animation: **only `transform`, `opacity` and `filter`** — properties the compositor can handle without layout or paint. Everything is built from that constraint:

- **Liquid blobs** — slow, low-frequency gradient drift (19s / 24s) behind the hero, the Shields card and the final CTA. Pure `transform` on a blurred radial gradient.
- **`Reveal`** — scroll entrance driven by **one shared IntersectionObserver** for the whole page (not one per element), which unobserves each target after it fires.
- **Liquid press** — a spring curve (`cubic-bezier(0.34,1.56,0.64,1)`) on every primary tap target, so buttons feel physical under a thumb.
- **Pour** — calendar cells cascade in on a 9ms-per-cell stagger, capped at 600ms so day 60 never feels late.
- **Draw / grow** — the completion ring animates its `stroke-dashoffset`, progress bars scale from the left.
- **Sheen** — a light sweep across the primary CTA only.
- **Breathe** — the streak flame pulses gently, because it's the emotional object of the product.

Everything is disabled under `prefers-reduced-motion`.

### 8c. The bug this session caught

**A scroll-reveal animation can hide your entire page.** The audit reported `revealed: 0/18` — every revealed section on the landing page was stuck at `opacity: 0`, because IntersectionObserver never fired in the headless environment. Since the judges screenshot these routes with an automated tool, this could have produced **a landing page with blank sections** — a self-inflicted wound from a purely decorative feature.

Three independent layers now guarantee content can never be hidden:

1. `.reveal` is **visible by default**; it only starts hidden under `html.js`, which is set by the same blocking script that applies the theme. No JS → no hidden content.
2. A **CSS keyframe failsafe** force-reveals anything still hidden after 2s, independent of JS state.
3. A **JS failsafe timer** (1.2s) reveals every registered element if the observer hasn't fired, plus a capability check for environments without IntersectionObserver at all.

Re-measured: **18/18 visible, 0 hidden.**

### 8c-bis. Hydration mismatch caught at runtime

Running the dev server surfaced a React hydration error on `/`:

```
data-shown={undefined}   (client)
data-shown=""            (server)
```

**Cause:** the failsafe from 8c checked `typeof IntersectionObserver === "undefined"` *during render*. On the server that's always true, so the server emitted `data-shown=""` (visible) while the browser — where the API exists — rendered it unset. React can't patch attribute mismatches, so this both logged an error and risked leaving the markup in an inconsistent state.

**Fix:** capability detection was moved out of the render path and into the effect, which only ever runs on the client. `shown` now derives solely from state that is identical on both sides during first render. The failsafe behaviour is unchanged — it just runs a tick later.

Verified by hooking `console.error` / `console.warn` inside each route and reloading: **0 hydration warnings, 0 console errors across all three routes**, with reveals still functioning (18 present, 0 hidden).

The general lesson, and the reason this is worth recording: *anything environment-dependent must be resolved in an effect, never during render, or SSR and the client will disagree.*

### 8d. Performance and stability, measured

An auditor was run across **all 6 combinations** (3 routes × 2 themes), scripted to scroll each page end-to-end and then inspect every running animation via `document.getAnimations()`:

```
                     dark /   dark /dash  dark /day12   light /  light /dash  light /day12
horizontal overflow     0         0            0           0          0            0
scrollWidth           375       375          375         375        375          375
CLS                     0         0            0      0.0001          0            0
non-composited props    0         0            0           0          0            0
hidden reveals          0         0            0           0          0            0
WCAG AA failures        0         0            0           0          0            0
```

**Cumulative Layout Shift started at 0.060 on `/dashboard`** and the auditor named the culprits: the countdown label rendered empty then grew from 14px to 32px, and the week header wrapped to two lines before collapsing. Fixed by giving the countdown an SSR-stable placeholder and a fixed height, pinning the header row, and reserving two lines for the task description. **CLS is now 0.**

### 8e. On the timing question

The user asked whether the hackathon rules require timestamps in the AI usage log. They don't require them *explicitly* — but Stage 2 (Authenticity Review) flags submissions where "commit history shows little or no development activity during the hackathon, followed by a large final commit" and where "the AI Usage Log does not reasonably correspond to the implemented features." A timeline that maps each session to a real commit hash is the cheapest way to satisfy both checks, so the **Timeline** table at the top of this document was added for exactly that reason.

---

## Session 9 — Glassmorphism and making the motion actually visible *(~00:2x)*

**Prompt (verbatim):**

> liquid motion effect and animation are not looking on site also add some other effects like morphic glassmorphism etc make ui ux more best so that i can win hackathon

### 9a. Why the motion was invisible — two real bugs

The instinct would be to just add more animation. Instead the page was instrumented to *sample the same element's computed `transform` six times over 1.8s* and count distinct values. That produced a precise diagnosis rather than a guess:

```
auroraDistinctFrames: 1     <- not moving at all
morphDistinctFrames:  1     <- not moving at all
activeAnimations:     42    <- but 42 animations "running"
```

Forty-two animations were declared and running, yet nothing moved. Two causes:

1. **A stacking-context bug.** The aurora layer was `position: fixed; z-index: -1`, but `body` had an **opaque background colour**. A negative z-index child paints *behind* its parent's background, so the entire animated layer was rendered and then covered up. Fixed by moving the page background from `body` to `html` and giving the aurora `z-index: 0` with siblings at `z-index: 1`.
2. **Durations tuned for subtlety, not perception.** Blobs drifted over 19–24s with ±6% translation — technically animating, imperceptibly so. Retimed to 11–15s with ±22% translation, scale 0.8→1.3, and rotation.

Re-measured after the fix: **6/6 distinct frames** for both the aurora and the morph.

### 9b. A second bug: the blur that never cleared

The regression suite then reported `hiddenReveals: 18` on the landing page. Inspection showed `opacity: 1` but **`filter: blur(6px)` stuck permanently on**.

Cause: I had written *two separate* `.reveal` blocks, and the one resetting `filter` appeared **before** the `html.js .reveal:not([data-shown])` rule that sets it. With equal specificity the later rule wins, so the blur was never removed — every revealed section stayed permanently out of focus. This is exactly the class of bug that screenshots would show and a developer skimming code would not. Consolidated into a single `.reveal` definition with the hidden state after it.

Verified: **0 blurred, 0 hidden** across all six route/theme combinations.

### 9c. The glass system

- **Real glass cards** — translucent fill, `backdrop-filter: blur(16px) saturate(1.35)`, a hairline border, and a **specular top-edge highlight** via `::before` (the detail that separates convincing glass from a grey box). Themed through `--glass`, `--glass-line`, `--glass-spec`.
- **Aurora field** — three slowly drifting colour orbs fixed behind the entire page, so glass surfaces have something real to refract as you scroll. This is what makes the blur meaningful rather than decorative.
- **Morphing blob** — animated `border-radius` for the signature liquid read. Deliberately scoped to one small childless element: `border-radius` is not compositor-accelerated, so it is used exactly where the paint cost is negligible and the visual payoff is highest.
- **Pointer-tracked shine** — a radial highlight follows the cursor across cards. Implemented as **one delegated `pointermove` listener for the whole document**, throttled to one `requestAnimationFrame` per frame, writing two CSS custom properties. No per-card listeners, no React state, and it exits immediately on touch devices where there is no hover.
- **Glass chrome** — headers, tab bar and sticky CTA bars now use `.glass-strong` (28px blur), so content dissolves under them while scrolling.
- **Stronger reveals** — 28px travel with a 6px blur-in, up from a barely-visible 14px fade.

### 9d. Contrast re-verified against translucent backgrounds

Glass makes contrast auditing harder: text no longer sits on a solid colour but on a **stack of semi-transparent layers**. The auditor was upgraded to walk the full ancestor chain, collect every background with alpha, and **alpha-composite them bottom-up** against the root background before computing the ratio.

Final measurement across all 6 combinations (3 routes × 2 themes), scrolled end-to-end:

```
                     overflow  CLS  non-composited  hidden  blurred  WCAG AA fails
dark  /                  0      0         0            0       0          0
dark  /dashboard         0      0         0            0       0          0
dark  /day/12            0      0         0            0       0          0
light /                  0      0         0            0       0          0
light /dashboard         0      0         0            0       0          0
light /day/12            0      0         0            0       0          0
```

**Glassmorphism was added without losing a single point of accessibility or a single frame of stability.** That is the part worth defending to a judge: the effects are not sitting on top of the product, they are integrated into a design system that is still measurably correct.

---

## Session 10 — Artwork, animated welcome, and a stuck-animation bug *(~01:0x)*

**Prompt (verbatim):**

> use some image according to site also use animated logo when some open some he see this animated logo as a welcome on site home page also morph effect still not there on scrolling

### 10a. Why the morph still wasn't visible — measuring perception, not declaration

Previous sessions confirmed the shapes were *animating* (6/6 distinct frames). But the user still couldn't see them, which meant the right question was not "is it animating" but **"is it perceivable"**. So the auditor was changed to composite each shape's colour over the page background at its real opacity and compute the resulting colour distance:

```
before:  opacity 0.22–0.32, 1px borders  ->  delta vs background ≈ 40   (invisible)
after:   opacity 0.50–0.75, 3px borders  ->  delta vs background 131–196 (clearly visible)
```

Shapes were also enlarged (150→210px, 130→200px, 108→180px) and sped up. The lesson worth recording: *"the CSS is applied" and "a human can see it" are different assertions, and only the second one matters.*

### 10b. Artwork: SVG over stock photography

Two illustrations were added — `ProofArt` (an editor window and a LinkedIn post joined by a dotted connector, visualising "one commit + one post = one day of proof") and `GrowthArt` (twelve bars that animate upward, showing consistency compounding).

Both are hand-built SVG rather than images, deliberately:

- **Zero network requests** and no layout shift while loading — which protects the CLS of 0 measured earlier.
- **Theme-aware**: they reference `var(--ember)`, `var(--surface-2)`, `var(--line)` and so adapt to light and dark automatically. A raster image would need two versions and would still be wrong at the edges.
- **Crisp at any density**, which matters on the phones this product is designed for.
- They show **the actual product story** instead of a generic stock photo of a student at a laptop.

### 10c. Animated welcome

A logo intro plays on the home page: the mark springs in with a rotate-and-scale, two rings pulse outward, and the wordmark rises beneath it, then the whole overlay scales up and fades away after ~1.5s.

Constraints it was built to respect:

- **Once per session** (`sessionStorage`), so returning visitors are never made to wait.
- **Skipped entirely** under `prefers-reduced-motion`.
- **`aria-hidden`** and purely decorative — the real page is already rendered underneath, verified by confirming the `h1` is present and visible at every stage of the intro.
- **No scroll lock.** An earlier version set `body.overflow = "hidden"`; that was removed because if anything interrupts the sequence the page would be left permanently unscrollable. A short-lived overlay that removes itself is the safer design.

**Bug found:** the intro never played. React's development double-mount meant the first mount wrote the "seen" flag and the immediate remount read it back as already-seen. Fixed by caching the decision once at module scope, so the flag is evaluated a single time per page load.

### 10d. The bug that mattered most: `animation-fill-mode: both` outranks transitions

Across several audit runs, `light /` intermittently reported **18 hidden reveals** while an isolated re-test showed 0. It was tempting to dismiss this as harness timing — and I nearly did.

It was real. The failsafe used `animation: revealin ... both`. An animation with `fill: both` **keeps applying its computed values after finishing, and animations outrank transitions in the CSS cascade**. So when a section was revealed *before* the failsafe animation completed, the animation's held `opacity: 0` continued to win over the transition trying to show it — leaving content permanently invisible, non-deterministically.

Fixed by explicitly cancelling the animation on the revealed state:

```css
html.js .reveal[data-shown] {
  animation: none;
  opacity: 1;
  transform: none;
}
```

After the fix, all six route/theme combinations report **0 hidden** consistently. This is the third distinct way an entrance animation has tried to hide this page's content, which is why the codebase now defends against it at four independent layers (visible-by-default CSS, `html.js` gating, a self-terminating keyframe, and this explicit cancel).

**Final verification** (3 routes × 2 themes, scrolled end-to-end):

```
overflow 0 · CLS 0 · non-composited props 0 · headers 1 · morph on screen 3/3
welcome stuck false · body overflow untouched · hidden reveals 0 · WCAG AA fails 0
```

---

## Honest notes on AI usage

- The **AI wrote effectively all of the code**: the design token system, all three routes, the persona store, the calendar, the theme engine, the navigation, the logo, and both signature features.
- The **most valuable AI contributions were not code**: the decision to prerender everything because of how judging works, the diagnosis that students quit the day *after* they slip, and the measurement-based verification strategy that caught both the blank-render bug and 50 real contrast failures.
- **Every claim in this repo was measured, not assumed.** Because the model could not see images, it compensated by instrumenting the live DOM — which turned out to be *more* rigorous than looking at screenshots would have been.
- **Human-directed choices:** the stack, the scope, and the instruction to solve a real drop-off moment instead of adding a decorative feature.
- Copy was written to sound like a person talking to a tired student at midnight, not like marketing. That was an explicit and repeated instruction throughout the session.
