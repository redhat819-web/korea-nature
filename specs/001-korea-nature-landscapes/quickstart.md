# Quickstart: 한국의 결 (Landscapes of Korea)

Validation guide for proving the implementation works end-to-end. No build step exists — this is a
static site, so "running" it means serving the repo root as static files.

## Prerequisites

- All files present at repo root: `index.html`, `styles.css`, `script.js`, `DESIGN.md`, `CREDITS.md`,
  `.nojekyll`, `assets/images/*.webp` (or equivalent, per research.md item 6/7).
- Every image referenced in `index.html` exists in `assets/images/` and has a matching row in
  `CREDITS.md` (see [credits-format-contract.md](./contracts/credits-format-contract.md)).
- A modern browser (Chrome/Edge/Firefox/Safari, latest) and a simple static file server (any of the
  below work; no Node build tooling required):
  - `npx serve .`
  - `python -m http.server 8080`
  - VS Code "Live Server" extension

## Run

1. From the repo root, start a static server, e.g.:
   ```
   python -m http.server 8080
   ```
2. Open `http://localhost:8080/index.html` in a desktop-width browser window (≥768px).

## Validation scenarios

### 1. Full journey scroll (User Story 1 — P1)

- Scroll from the very top through to the bottom without clicking anything.
- **Expect**: Hero → 설악산 → 제주 → 순천만 → 보성 녹차밭 → CTA/footer appear in that exact order;
  every place shows Korean name, English name, one-line tagline, both body paragraphs in full, and
  2–3 keywords; nothing is cut off or replaced by a caption-only summary.
- Click "처음 풍경부터 다시 보기" at the end. **Expect**: page scrolls back to the Hero (no page
  navigation, no reload).

### 2. Desktop continuous scroll choreography (User Story 2 — P2)

- With the browser at ≥768px width and OS motion settings at default (not reduced), scroll slowly
  with a mouse wheel or trackpad.
- **Expect**: only one visible "stuck" region for the whole journey (the pinned stage) — no
  per-place stop-and-release stutter; the next place's image visibly scales up and fades in while
  the current one fades out (a 20–30% overlap window); place name → tagline → body text appear with
  a slight stagger, not all at once.
- Scroll a large distance in one fast wheel flick. **Expect**: the scene advances proportionally to
  scroll distance — it does not snap/teleport straight to the next full scene.
- Confirm in DevTools that no `scroll-snap-type` CSS is applied anywhere and that no `wheel` event
  listener calls `preventDefault()` or `window.scrollTo` outside the CTA "back to top" button.

### 3. Mobile fallback (User Story 3 — P2)

- Resize the browser (or use DevTools device emulation) to ≤767px width.
- **Expect**: the pin disengages; the page becomes a normal scrollable document — image, then full
  text, then next place's image, etc.; both body paragraphs remain fully visible (not hidden,
  not truncated); transitions (if any) are simple fades/reveals, not scale/cross-fade tunnel effects.
- Check `#stage[data-mode]` in DevTools — should read `plain-flow` at this width.

### 4. Reduced motion (User Story 4 — P3)

- Enable "Reduce motion" (macOS: System Settings → Accessibility → Display; Windows: Settings →
  Accessibility → Visual effects; or DevTools → Rendering tab → "Emulate CSS
  prefers-reduced-motion: reduce").
- Reload the page at desktop width.
- **Expect**: `#stage[data-mode]` reads `plain-flow` even at desktop width; no pin, no scale/cross-
  fade; all text and images are immediately fully visible while scrolling normally.

### 5. Keyboard accessibility

- Tab through the page using only the keyboard.
- **Expect**: the "처음 풍경부터 다시 보기" button (and any other interactive element) receives a
  visible focus state and activates on Enter/Space.

### 6. Resize and asset-load correctness

- At desktop width, open DevTools → Network, throttle to "Slow 3G", and reload.
- **Expect**: Hero title/lead text is readable immediately even before images finish loading; once
  images and fonts finish loading, scroll math is correct end-to-end (scrolling to the very bottom
  reaches the CTA, not an overshoot/undershoot past it — verifying `ScrollTrigger.refresh()` fired
  after load).
- With the page loaded at desktop width, resize the window across the 768px breakpoint a few times.
  **Expect**: no visual glitching, no dead scroll space, `#stage[data-mode]` and the pin/flow
  behavior update correctly each time.

### 7. Subpath deployment (GitHub Pages)

- Serve the repo from a subpath, e.g. `python -m http.server 8080` from one directory up while
  requesting `http://localhost:8080/korea-nature/index.html` (rename/symlink the project folder to
  simulate `username.github.io/korea-nature/`), or push to a real GitHub Pages project site.
- **Expect**: all images and any internal links load correctly (no 404s) because every path is
  relative (`./assets/...`), never root-absolute.

### 8. Image integrity and credits

- Open each `assets/images/*` file directly in the browser — confirm it renders as a real photo
  (not corrupted, not a 0-byte file, not a placeholder graphic).
- Cross-check every file against `CREDITS.md`: each file has exactly one row with a working source
  URL, a named author, an explicit commercial+derivative-permitting license, and a verified date.

## Definition of done for this quickstart

All 8 scenarios above pass with no outstanding placeholder images and no console errors.
