# Phase 0 Research: 한국의 결 (Landscapes of Korea)

All technical choices were fully specified by the user's tech-stack instructions and the ratified
constitution; this research resolves the remaining implementation-pattern decisions needed to
satisfy the "one pin / one master timeline / no scroll-snap / no wheel hijack" constraints safely.

## 1. Single-pin master timeline architecture with GSAP ScrollTrigger

- **Decision**: Wrap the entire journey (Hero + 4 places + CTA) in one `#stage` element containing
  absolutely-positioned `.scene` layers (image + text per scene). Create exactly one
  `ScrollTrigger` with `pin: "#stage"`, `start: "top top"`, `end: "+=" + (window.innerHeight * SCENE_COUNT * SCROLL_LENGTH_MULTIPLIER)`,
  and `scrub: 1.2`. Attach one GSAP `timeline({ scrollTrigger: {...} })` and add all per-scene
  tweens (image scale, cross-fade opacity, text translate/fade, parallax) as timeline children at
  explicit time offsets (`"<"`, `"-=0.3"` overlaps) so consecutive scenes visually overlap by
  ~20-30% of their duration.
- **Rationale**: A single pin/timeline is the only way to guarantee scroll input maps to one
  continuous, proportional progress value across the whole journey — this is what makes
  cross-fades and "tunnel" entry effects possible without per-section jumps, and it is what the
  user explicitly mandated ("장소별로 ScrollTrigger pin을 여러 개 만들지 말고... 하나의 pin과
  하나의 master timeline").
- **Alternatives considered**: Per-section `ScrollTrigger.create({pin: true})` (rejected — this is
  the classic "pinned sections" pattern that produces the stop/release stutter the user explicitly
  forbade); IntersectionObserver-triggered CSS animations (rejected — cannot produce scroll-scrubbed,
  input-proportional cross-fades, only enter/exit thresholds); native CSS `scroll-timeline` (rejected
  — insufficient cross-browser support in evergreen browsers as of this build, and offers less
  control over overlapping multi-property choreography than GSAP timeline position parameters).

## 2. Scrub value and easing

- **Decision**: Use `scrub: 1.2` (seconds of smoothing lag) on the master ScrollTrigger, and
  `ease: "none"` on every tween placed inside the scrubbed timeline.
- **Rationale**: A numeric scrub (vs. `scrub: true`) adds a short smoothing delay so the animation
  "catches up" to the scrollbar instead of being rigidly locked to it, producing the fluid, weighty
  feel the user asked for ("1~1.5초 안팎의 숫자 값"). `ease: "none"` inside a scrubbed timeline is
  required because scrub already derives velocity from scroll position — any additional easing
  curve on the tweens would double-apply acceleration/deceleration and cause the "sudden speed-up"
  effect the user explicitly prohibited.
- **Alternatives considered**: `scrub: true` (rejected — feels rigid/laggy on fast wheel input,
  exactly the "장면이 순간 교체" risk); per-tween eases like `power2.out` (rejected per explicit
  instruction and because it conflicts with scrub-driven timing).

## 3. Reduced motion & mobile fallback strategy

- **Decision**: Feature-detect via `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
  and `window.matchMedia('(max-width: 767px)').matches` at load and on resize. When either is true,
  never call `ScrollTrigger.create(...)`/build the pinned timeline at all — instead render (via a
  CSS class toggle on `<body>`, e.g. `.is-flow`) the same DOM as a normal unpinned vertical document
  with simple per-section `fade+translateY` reveals driven by lightweight `IntersectionObserver`
  entries (or plain CSS `@media` + `:target`-free scroll-into-view, kept minimal). When both
  conditions become false again (e.g., a reduced-motion user resizes to desktop is not a realistic
  live-toggle case, but width crossing 768px live is), destroy and rebuild the appropriate mode.
- **Rationale**: The user requires the desktop pin/scrub choreography to be completely absent (not
  just paused) under `prefers-reduced-motion` and below the 768px breakpoint (per spec Clarifications).
  Building two disjoint code paths that share the same markup avoids any risk of a hidden pinned
  container silently reserving scroll space on mobile.
- **Alternatives considered**: Keeping ScrollTrigger active everywhere but setting all durations to 0
  (rejected — pin still reserves layout space and can visually glitch weirdly on narrow viewports);
  server-side/user-agent device detection (rejected — no server exists, and viewport width is the
  clarified, testable criterion).

## 4. Resize and asset-load timing

- **Decision**: Call `ScrollTrigger.refresh()` inside a `window.addEventListener('load', ...)`
  handler after all `<img>` elements report `complete` (checked via `Promise.all` over each image's
  `decode()`/`load` event) and after the Google Fonts `FontFace` set resolves via
  `document.fonts.ready`. Debounce a `resize` listener (~150ms) that calls
  `ScrollTrigger.refresh()` again, and re-evaluates the mobile/reduced-motion mode switch from
  research item 3.
- **Rationale**: ScrollTrigger caches trigger start/end pixel positions at creation time; if images
  or web fonts finish loading after that (changing document height), the cached positions go stale
  and the pin end-point drifts. Explicitly refreshing after asset load and after resize is the
  documented GSAP-recommended fix and directly satisfies the user's stated requirement.
- **Alternatives considered**: `ScrollTrigger.config({ autoRefreshEvents: ... })` alone (rejected —
  does not cover late image decode in all browsers reliably without an explicit load-driven
  refresh); polling on a timer (rejected — wasteful and imprecise vs. event-driven refresh).

## 5. Performance-safe animated properties

- **Decision**: Animate only `transform` (`scale`, `translateX/Y`, and CSS `clip-path`/`mask`
  offsets for reveal effects) and `opacity`. Parallax is implemented via `translateY` at differing
  timeline-relative speeds for a `.scene__bg` layer vs a `.scene__fg` layer, not via
  `background-position`. `will-change: transform, opacity` is applied only to the currently
  active/adjacent `.scene` elements (added when a scene enters the animatable window, removed once
  it's fully out of range) rather than globally.
- **Rationale**: Directly implements the user's stated performance principles — transform/opacity
  avoid layout thrash and are GPU-composited; unscoped `will-change` on every scene would instead
  waste compositor memory continuously. `clip-path`/mask-based reveal is composited and avoids the
  `filter: blur()` continuous-animation the user asked to avoid.
- **Alternatives considered**: Animating `top`/`left`/`width`/`height` for parallax (rejected —
  triggers layout recalculation every frame); animating `filter: blur()` for a depth effect
  (rejected — explicitly prohibited as expensive when animated continuously).

## 6. Image sourcing sources and licensing

- **Decision**: Source candidate photos from Wikimedia Commons first (explicit per-file license
  tags, most reliably CC0/CC-BY/CC-BY-SA), falling back to Unsplash or Pexels (both publish blanket
  licenses that permit commercial use and modification without attribution required, though
  attribution will still be recorded voluntarily in CREDITS.md for transparency). Each candidate's
  original detail page is opened to confirm the specific license and photographer/uploader name
  before download — thumbnail or search-result URLs are never used directly.
- **Rationale**: Matches the clarified requirement (FR-015) that only licenses permitting both
  commercial use and derivatives (resize/crop/format conversion) are acceptable, and matches the
  constitution's insistence on verifiable, attributable sourcing.
- **Alternatives considered**: Generic image-search thumbnails or unsourced blog photos (explicitly
  rejected by the user); stock sites requiring paid licenses (out of scope — no budget/account
  mechanism specified, and free-to-use sources are sufficient for this use case).

## 7. Font substitution for DESIGN.md's proprietary typeface

- **Decision**: Use **Inter** (already documented in DESIGN.md as its body/secondary typeface and
  confirmed open-source/SIL-licensed) for all body text, and use **Inter** at a heavier weight
  (600–700) with manually tightened negative letter-spacing as the display/headline substitute for
  GT Walsheim Medium, exactly as DESIGN.md's own "Note on Font Substitutes" section recommends.
  Loaded via Google Fonts `<link>` (or self-hosted `.woff2` if Google Fonts CDN is undesired) rather
  than copying any proprietary font file.
- **Rationale**: Satisfies the user's explicit instruction not to copy custom font files without
  rights, while staying visually aligned with DESIGN.md's documented hierarchy (size/weight/letter-
  spacing tokens are preserved; only the specific typeface swaps to a legally-usable one DESIGN.md
  itself names as an acceptable substitute).
  Alternatives considered: Mona Sans, Geist (both also named in DESIGN.md as acceptable substitutes)
  — kept as a documented fallback option in case Inter's negative-tracking display treatment reads
  too plain in practice; system `sans-serif` stack as ultimate fallback if no webfont loads.

## Outstanding Items

None — all NEEDS CLARIFICATION markers from the Technical Context are resolved above. Actual image
selection (which specific Commons/Unsplash/Pexels photo per place) is an implementation-time task,
not a planning-time research question, and is captured in tasks.md.
