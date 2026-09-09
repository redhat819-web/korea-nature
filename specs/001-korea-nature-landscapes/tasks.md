---

description: "Task list for 한국의 결 (Landscapes of Korea)"
---

# Tasks: 한국의 결 (Landscapes of Korea)

**Input**: Design documents from `/specs/001-korea-nature-landscapes/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md (all present)

**Tests**: Not requested — this feature uses manual browser validation via `quickstart.md` instead of an automated test suite (per plan.md Technical Context).

**Organization**: Tasks are grouped by user story per spec.md priorities (US1=P1, US2=P2, US3=P2, US4=P3). Because this is a single-page static site, most stories share `index.html`/`styles.css`/`script.js` — `[P]` is only used where files genuinely don't overlap (e.g. independent image downloads).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- File paths are relative to repo root `C:\AI_SERVICE\korea-nature`

---

## Phase 1: Setup

**Purpose**: Repo scaffolding and shared tooling references — no content yet.

- [X] T001 Create `.nojekyll` (empty file) at repo root so GitHub Pages serves the site without Jekyll processing
- [X] T002 Create `assets/images/` directory at repo root (empty, to be populated in Phase 2)
- [X] T003 Create skeleton `index.html` at repo root with `<!doctype html>`, `<html lang="ko">`, `<head>` (charset, viewport meta, `<title>한국의 결 | LANDSCAPES OF KOREA</title>`), Google Fonts `<link>` for Inter (per research.md item 7), GSAP core + ScrollTrigger `<script>` tags loaded from a pinned-version CDN URL (e.g. cdnjs), a link to `./styles.css`, and an empty `<body>` with `<div id="stage" data-mode="pinned-journey"></div>` and `<script src="./script.js" defer></script>`
- [X] T004 Create empty `styles.css` at repo root with a `:root` block defining CSS custom properties transcribed from `DESIGN.md` tokens (colors, spacing, radius) reinterpreted for this content, plus a global reset (box-sizing, margin, `img{max-width:100%}`)
- [X] T005 Create empty `script.js` at repo root with a top-level `(function () { 'use strict'; ... })();` IIFE shell and `console.log`-free placeholder comments for the sections to be filled in later phases (scene registry, mode detection, pinned-journey builder, plain-flow builder, CTA handler)

**Checkpoint**: Static skeleton loads in a browser with no console errors, no content yet.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Real, rights-cleared images and the full content markup that every user story depends on. No story can be honestly demoed with placeholder content, so this phase must fully complete first.

**⚠️ CRITICAL**: Per constitution Principle VI and spec FR-015/FR-018, do NOT substitute placeholder images if sourcing is incomplete — report explicitly which place is missing and stop rather than marking this phase done.

- [X] T006 [P] Search Wikimedia Commons (preferred) / Unsplash / Pexels for a Hero-suitable Korea nature landscape photo; open its original detail page to confirm photographer/author and a commercial+derivative-permitting license (CC0/CC-BY/CC-BY-SA/Unsplash/Pexels License); download the original to a temp location
- [X] T007 [P] Same process as T006 for a 설악산 (Seoraksan) representative photo
- [X] T008 [P] Same process as T006 for a 제주 (Jeju) representative photo
- [X] T009 [P] Same process as T006 for a 순천만 (Suncheon Bay) representative photo
- [X] T010 [P] Same process as T006 for a 보성 녹차밭 (Boseong Tea Fields) representative photo
- [X] T011 Optimize and save the 5 selected photos into `assets/images/` as `hero-korea.webp`, `seoraksan.webp`, `jeju.webp`, `suncheon-bay.webp`, `boseong-tea-fields.webp` (or `.jpg` per-file if license/quality requires, per research.md item 6), resizing/re-encoding for web delivery without violating license terms or visibly degrading quality; record the final pixel dimensions of each for use in T013
- [X] T012 Create `CREDITS.md` at repo root with the table format from `specs/001-korea-nature-landscapes/contracts/credits-format-contract.md`, with one verified row per image from T006–T011 (file path, author, original source URL, license, verified date)
- [X] T013 Build out the full content structure in `index.html` per `specs/001-korea-nature-landscapes/contracts/dom-scene-contract.md`: `#stage` containing, in order, `.scene#hero`, four `.scene.scene--place` sections (`#seoraksan`, `#jeju`, `#suncheon-bay`, `#boseong-tea-fields`, each with `data-scene` and `data-layout` alternating `image-left`/`image-right`/`panel-overlay` per FR-006), and `.scene.scene--cta#cta`; populate every text field with the exact copy from `specs/001-korea-nature-landscapes/spec.md` (Hero title/titleEn/lead, each place's nameKo/nameEn/tagline/2 body paragraphs/keywords, CTA title/body/button label) — no summarizing or shortening
- [X] T014 Wire each `.scene__bg` `<img>` in `index.html` to its local `./assets/images/...` file from T011, with `width`/`height` attributes matching the optimized dimensions and a concrete, scene-specific Korean `alt` description (not a repeat of the tagline) per FR-017
- [X] T015 In `styles.css`, add base typographic and layout rules for `.scene__panel`, `.scene__title`, `.scene__tagline`, `.scene__body` using DESIGN.md-derived tokens: desktop body text 17–20px, line-height 1.65–1.85, reading-panel max-width 36–48rem, plus the `image-left` / `image-right` / `panel-overlay` variants driven by `[data-layout]` so each place's image/text position, margins, and alignment differ (FR-006)
- [X] T016 In `styles.css`, add a legible-contrast text treatment for panels sitting over photos — a localized gradient or translucent panel background behind `.scene__panel` text (not a full-photo darkening overlay) per the plan's contrast requirement

**Checkpoint**: Opening `index.html` directly (no JS) shows a plain but complete, fully-readable document with all real photos and all real copy in the correct order — this is the honest fallback content every later phase enhances.

---

## Phase 3: User Story 1 - 스크롤로 네 장소의 풍경과 글을 순서대로 감상하기 (Priority: P1) 🎯 MVP

**Goal**: A visitor can scroll from Hero through all four places to the CTA/footer in the fixed order, with every required content field visible and readable, and return to the top via the CTA button.

**Independent Test**: Scroll top-to-bottom in any browser width; confirm every section's full content appears in order and the CTA button returns to Hero.

- [X] T017 [US1] In `script.js`, implement a scene registry: `const scenes = Array.from(document.querySelectorAll('#stage .scene'))` mapped to `{ el, id: el.dataset.scene, layout: el.dataset.layout }`, used by all later logic instead of hard-coded place names
- [X] T018 [US1] In `script.js`, implement `bindCtaButton()`: attach a click handler to `[data-action="scroll-to-top"]` that calls `window.scrollTo({ top: 0, behavior: 'smooth' })`; call it once on init
- [X] T019 [US1] In `styles.css`, add a baseline (non-GSAP) transition for `.scene`: each scene is a full-viewport-height block in normal document flow by default (`min-height: 100vh`), so with JS disabled or before any animation JS runs, the page is already a complete, scrollable, readable single-column document satisfying FR-001–FR-004 as a floor
- [X] T020 [US1] Add a `<footer class="site-footer">` after `#stage` in `index.html` with a minimal footer per spec.md (site title/attribution line), styled minimally in `styles.css`

**Checkpoint**: At this point, User Story 1 is independently functional — full content, correct order, working CTA — even before any GSAP choreography exists.

---

## Phase 4: User Story 2 - 데스크톱에서 장면이 이어지는 몰입형 스크롤 전환 경험하기 (Priority: P2)

**Goal**: On desktop (≥768px, motion not reduced), scrolling drives one continuous pinned journey with image scale/cross-fade, foreground/background parallax, mask-based reveal, and staggered text entrance — no per-section pin stutter, no scroll-snap, no forced scrollTo, no single-wheel-flick scene replacement.

**Independent Test**: At ≥768px width with default OS motion settings, scroll slowly and confirm one continuous pinned region with overlapping cross-fade/scale transitions and staggered text; scroll a large distance in one flick and confirm proportional (non-teleporting) advancement.

- [X] T021 [US2] In `styles.css`, add the pinned-journey layout: `#stage[data-mode="pinned-journey"]` uses `position: relative` with each `.scene` absolutely positioned to fill the viewport (`position: absolute; inset: 0`), `.scene__bg` and `.scene__panel` as separate transformable layers, `overflow: hidden` on `#stage` for mask/reveal effects
- [X] T022 [US2] In `script.js`, implement `buildPinnedJourney(scenes)`: register `gsap.registerPlugin(ScrollTrigger)`, create one `ScrollTrigger` with `trigger: '#stage'`, `pin: true`, `start: 'top top'`, `end: () => '+=' + (window.innerHeight * scenes.length * 1.2)`, `scrub: 1.2`, and a single `gsap.timeline({ scrollTrigger: {...} })` per research.md item 1
- [X] T023 [US2] In `script.js`, for each consecutive scene pair in the master timeline, add: outgoing scene `.scene__bg` scale-up + opacity fade-out, incoming scene `.scene__bg` scale-in-from-slightly-larger + opacity fade-in, positioned with `"-=X"` timeline offsets so the two overlap 20–30% of their duration (cross-fade + "tunnel" entry per research.md item 1), all tweens using `ease: 'none'` (research.md item 2)
- [X] T024 [US2] In `script.js`, within the same timeline, add per-scene text entrance: `.scene__name-en`/`.scene__name-ko` → `.scene__tagline` → `.scene__body`/`.scene__keywords` each animated via `opacity` + `translateY` with a small stagger (sequential offsets), and an explicit hold segment (no active tween) sized so each place's text remains fully visible for at least the FR-007 minimum reading duration before the next cross-fade begins
- [X] T025 [US2] In `script.js`, implement foreground/background parallax: `.scene__bg` and `.scene__panel` move at different `translateY` rates relative to the same scrub progress (background slower, foreground/text faster or static) using only `transform`, per research.md item 5
- [X] T026 [US2] In `styles.css`, add an `overflow`/`clip-path`-based reveal treatment for incoming scene panels (e.g. `clip-path: inset(...)` animated via GSAP in `script.js`) rather than a plain opacity-only entrance, satisfying the "mask 기반 reveal" requirement
- [X] T027 [US2] In `script.js`, add scoped `will-change: transform, opacity` toggling: add the property to a scene's `.scene__bg`/`.scene__panel` only while it is within ~1 scene-length of the current scrub progress, and remove it once out of range (research.md item 5)
- [X] T028 [US2] Verify in DevTools that no `scroll-snap-type` rule exists anywhere in `styles.css` and no `wheel`/`touchmove` listener calls `preventDefault()` or a forced `scrollTo` outside the CTA button handler from T018 (FR-009 compliance check)

**Checkpoint**: User Stories 1 AND 2 both work — full content plays through one continuous, non-jarring pinned scroll journey on desktop.

---

## Phase 5: User Story 3 - 모바일에서 읽기 쉬운 세로 흐름으로 콘텐츠 확인하기 (Priority: P2)

**Goal**: Below 768px viewport width, the pin/scale/cross-fade choreography is fully disabled and replaced with a normal vertical document flow with simple reveal transitions, while all text remains fully visible.

**Independent Test**: At ≤767px width, scroll through the full page; confirm `#stage[data-mode]` reads `plain-flow`, no pin/scale/cross-fade occurs, and every body paragraph is fully present.

- [X] T029 [US3] In `script.js`, implement `detectMode()`: returns `'plain-flow'` if `window.matchMedia('(max-width: 767px)').matches` OR `window.matchMedia('(prefers-reduced-motion: reduce)').matches`, else `'pinned-journey'`
- [X] T030 [US3] In `script.js`, implement `applyMode(mode)`: sets `#stage.dataset.mode = mode`; if `mode === 'pinned-journey'`, calls `buildPinnedJourney(scenes)` (T022); if `mode === 'plain-flow'`, ensures no `ScrollTrigger`/pinned timeline is created (kill and clear any existing one via `ScrollTrigger.getAll().forEach(st => st.kill())` and `gsap.set` reset of inline transforms) and instead calls `buildPlainFlow(scenes)`
- [X] T031 [US3] In `script.js`, implement `buildPlainFlow(scenes)`: for each `.scene`, use a lightweight `IntersectionObserver` to toggle a `.is-visible` class once ~20% visible, triggering a simple CSS fade+translateY reveal (not GSAP scrub) defined in `styles.css`
- [X] T032 [US3] In `styles.css`, add `#stage[data-mode="plain-flow"] .scene` rules that override the Phase 4 absolute/pinned positioning back to normal flow (`position: static`, `min-height: 100vh` per-scene stacking, no `overflow: hidden` clipping of panel content) and a `.scene.is-visible` transition rule (`opacity`/`transform` reveal, short duration, simple ease)
- [X] T033 [US3] In `script.js`, call `detectMode()` + `applyMode()` once on initial load (the debounced resize handler that re-runs them on breakpoint crossing is implemented fully in T037)

**Checkpoint**: User Stories 1, 2, AND 3 all work — mobile visitors get the full content in a simple, reliable vertical flow.

---

## Phase 6: User Story 4 - 움직임에 민감한 사용자가 축소된 모션으로 콘텐츠 확인하기 (Priority: P3)

**Goal**: Users with `prefers-reduced-motion: reduce` get the same `plain-flow` experience as mobile, even at desktop width, with no scale/cross-fade/parallax/stagger.

**Independent Test**: Enable OS "reduce motion", reload at desktop width; confirm `#stage[data-mode]` reads `plain-flow` and all content is immediately fully visible with no tunnel/parallax animation.

- [X] T034 [US4] In `script.js`, add a `window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', ...)` listener that re-runs `detectMode()` + `applyMode()` so a live OS-level toggle (where supported) updates the page without requiring a manual reload
- [X] T035 [US4] In `script.js`, confirm (and adjust if needed) that `buildPlainFlow()`'s `IntersectionObserver` reveal transition (T031) itself also respects reduced motion — when reduced motion is active, skip the fade/translate transition entirely and show `.scene` content at full opacity/position immediately (no motion at all, not just "simple" motion)

**Checkpoint**: All 4 user stories complete — full accessibility coverage per spec.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Load/resize correctness, performance hardening, and final validation against `quickstart.md`.

- [X] T036 In `script.js`, implement asset-ready refresh: `Promise.all([...document.images].map(img => img.decode ? img.decode().catch(()=>{}) : Promise.resolve()))` combined with `document.fonts.ready`, then call `ScrollTrigger.refresh()` once both resolve (research.md item 4)
- [X] T037 In `script.js`, implement a debounced (~150ms) `resize` listener that calls `ScrollTrigger.refresh()` and re-runs `detectMode()`/`applyMode()` (ties together T033/T037 into one shared handler)
- [X] T038 Run through all 8 scenarios in `specs/001-korea-nature-landscapes/quickstart.md` end-to-end in a real browser (full journey, desktop choreography, mobile fallback, reduced motion, keyboard access, resize/load timing, subpath deployment, image/credit integrity) and fix any failures found
- [X] T039 Verify every image file in `assets/images/` opens correctly as a valid, undamaged image and cross-check each against its `CREDITS.md` row per `specs/001-korea-nature-landscapes/contracts/credits-format-contract.md`
- [X] T040 Review `index.html`/`styles.css` for semantic HTML correctness (`header`/`main`/`section`/`figure`/`footer` usage where appropriate) and full keyboard operability of the CTA button, per constitution Principle IV
- [X] T041 Grep `index.html`, `styles.css`, and `script.js` for any root-absolute asset reference (`"/assets`, `'/assets`, `url(/assets`) and confirm zero matches, so FR-014 (relative paths only) holds beyond the subpath-deployment spot check in T038

---

## Dependencies & Execution Order

- **Phase 1 (Setup)** → no dependencies, do first.
- **Phase 2 (Foundational)** → depends on Phase 1; BLOCKS all user stories (no story can be honestly tested without real content/images).
- **Phase 3 (US1, P1)** → depends on Phase 2. This is the MVP.
- **Phase 4 (US2, P2)** → depends on Phase 3 (enhances the same scenes/timeline scaffold; needs `scenes` registry and CTA/footer already in place).
- **Phase 5 (US3, P2)** → depends on Phase 4 (the mode switch must kill/rebuild the pinned journey from Phase 4, so pinned-journey logic must exist first).
- **Phase 6 (US4, P3)** → depends on Phase 5 (reuses the same `detectMode`/`applyMode`/`plain-flow` machinery).
- **Phase 7 (Polish)** → depends on all previous phases.

Within Phase 2, T006–T010 (image sourcing) are parallelizable [P] since each targets a different photo/place with no file overlap; T011 onward are sequential because they consolidate into shared files (`CREDITS.md`, `index.html`, `styles.css`).

## Parallel Execution Example (Phase 2)

```
T006 (Hero photo search) \
T007 (Seoraksan photo search) \
T008 (Jeju photo search)       ⟶ run together, then T011 (optimize+save all) once all 5 are found
T009 (Suncheon Bay photo search) /
T010 (Boseong photo search)   /
```

## Implementation Strategy

**MVP = Phase 1 + Phase 2 + Phase 3 (User Story 1)**: a fully content-complete, correctly-ordered, readable single page with real sourced photos and a working "back to top" CTA — no GSAP choreography yet. This alone satisfies the core purpose (편집형 문화관광 소개) and can be deployed/demoed.

**Incremental delivery from there**:
1. Ship MVP (Phases 1–3).
2. Add Phase 4 (desktop tunnel/cross-fade choreography) — the signature differentiator.
3. Add Phase 5 (mobile plain-flow) — required before any real mobile traffic is acceptable.
4. Add Phase 6 (reduced-motion) — accessibility completeness.
5. Phase 7 polish and full quickstart sign-off before considering the feature done.
