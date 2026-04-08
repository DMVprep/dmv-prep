# Sprint 3 Backlog (from April 7 session)

## High priority bugs found

### 1. "Fix This Now" shows unrelated lesson
**File:** src/app/practice/page.tsx (around the relatedLesson fetch)
**Bug:** Code picks a random lesson from the question's topic category instead of matching the specific question.
```js
const lesson = data.lessons[Math.floor(Math.random() * data.lessons.length)];
```
**Fix needed:** Either (a) add a `relatedLessonSlug` field to Question model and link directly, or (b) match on keywords between question.text and lesson.title, or (c) just hide the box until properly fixed.

### 2. Missing sign images on sign questions
**Symptom:** Traffic Signs questions don't show the actual sign image.
**Investigation needed:** Check if the questions have `imageUrl` populated in the database, or if the CDN path is broken. The practice page already renders `q.imageUrl` when present.

## Features deferred from Sprint 2

### 3. Inline vocabulary tooltips on practice questions
Scan question text for known vocab terms, wrap them in a <GlossaryTerm> component that shows a popover on hover/tap with the plain-English definition. Biggest ESL win. ~60-90 min of careful work. Risk: must not break answer selection flow on mobile.

### 4. Homepage headline rewrite
"Pass Your DMV Test on the First Try" is identical to Zutobi. SEO-sensitive change. Needs A/B thinking before touching.

## SEO work (user flagged April 7)
The site's SEO is "in the toilets" — deserves its own dedicated session. Start with:
- Search Console audit (indexed pages, crawl errors, search queries)
- Core Web Vitals check
- Internal linking audit
- Keyword cannibalization check (all the state/language permutation pages)
- Meta descriptions audit post-Sprint 1 (we updated the homepage but not state pages)

## Sprint 3 ideas (lower priority)
- Expand translated questions coverage — verify all 400+ per state are actually translated in ES/ZH/PT/FR
- "Translate this question" inline button instead of hover menu
- Onboarding flow: "What's your native language?" → pre-select translation
- Worked examples inside lessons
- CDL & Motorcycle prep
- PWA / offline mode
- B2B tier (driving schools)

## Vocabulary Rules (DO NOT re-introduce these terms)
These words were removed in Sprint 1 and should NEVER appear again:
- "Pass System" → use "review plan" or "auto-review"
- "SmartRecall" → use "short lessons in plain English"
- "spaced repetition" → use "we bring back what you got wrong"
- "Autopilot mode" → use "we remind you"
- "Memory Strength" → use "what you remember"
- "Smart Study Plan" / "Smart Study Plans" → use "study schedule"
- "Active recall" → use "questions you miss come back until you know them"
- "Deep learning" (as in study plan) → use "take your time"
- "Pass" (as tier name) → use "One State"

## Nav structure
Final nav: **Learn | Practice | Dashboard | Blog** (logged in) or **Learn | Practice | Pricing | Blog** (logged out). Sign out / My Progress / Pricing live in avatar dropdown. Do not add items back without discussion.

## Design baseline (as of April 7)
- Font: Nunito Sans (weights 400/600/800)
- Page background: #FBF8F3 (warm cream via .min-h-screen.bg-gray-50 override)
- Cards: still white
- Accent: still blue (#2563eb range)
