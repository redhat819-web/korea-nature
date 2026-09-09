# Contract: DOM Scene Structure (index.html ↔ script.js)

This is the internal "interface" between the static markup (`index.html`) and the animation logic
(`script.js`). There is no network API in this project; this contract is the closest equivalent —
it fixes the attribute/class names `script.js` queries so markup and behavior stay in sync.

## Required structure

```html
<body>
  <div id="stage" data-mode="pinned-journey">
    <section class="scene" id="hero" data-scene="hero">
      <img class="scene__bg" src="./assets/images/hero-korea.webp" alt="…" width="…" height="…">
      <div class="scene__panel">
        <h1 class="scene__title">한국의 결</h1>
        <p class="scene__title-en">LANDSCAPES OF KOREA</p>
        <p class="scene__lead">…</p>
      </div>
    </section>

    <section class="scene scene--place" id="seoraksan" data-scene="seoraksan" data-layout="image-left">
      <img class="scene__bg" src="./assets/images/seoraksan.webp" alt="…" width="…" height="…">
      <div class="scene__panel">
        <p class="scene__name-en">SEORAKSAN</p>
        <h2 class="scene__name-ko">설악산</h2>
        <p class="scene__tagline">바위 능선 사이로 계절이 지나가는 산</p>
        <p class="scene__body">…첫 번째 문단…</p>
        <p class="scene__body">…두 번째 문단…</p>
        <ul class="scene__keywords">
          <li>암봉과 계곡</li>
          <li>사계절</li>
          <li>깊은 숲</li>
        </ul>
      </div>
    </section>

    <!-- repeat .scene.scene--place for jeju, suncheon-bay, boseong-tea-fields -->

    <section class="scene scene--cta" id="cta" data-scene="cta">
      <div class="scene__panel">
        <h2 class="scene__title">오래 보고 싶은 풍경은 천천히 남습니다</h2>
        <p class="scene__lead">…</p>
        <button type="button" class="cta__button" data-action="scroll-to-top">처음 풍경부터 다시 보기</button>
      </div>
    </section>
  </div>

  <footer class="site-footer">…</footer>
</body>
```

## Rules script.js relies on

1. `#stage` is the single pin target. It must directly contain all `.scene` elements in DOM order
   matching the required page order (hero → seoraksan → jeju → suncheon-bay →
   boseong-tea-fields → cta).
2. Every `.scene` MUST carry a unique `data-scene` value; `script.js` builds its timeline scene
   array by querying `#stage .scene` in DOM order and reading this attribute — it does not
   hard-code a place list, so adding/removing a `.scene` element updates the journey without a
   script change (other than content-specific tween details).
3. `.scene--place` elements MUST carry `data-layout` (`image-left` | `image-right` |
   `panel-overlay`) — `styles.css` and `script.js` both read this to vary panel position/parallax
   offsets per FR-006.
4. `[data-action="scroll-to-top"]` MUST exist exactly once; `script.js` attaches a click handler
   that calls `window.scrollTo({ top: 0, behavior: 'smooth' })` (or an equivalent GSAP
   `scrollTo` plugin call) — no page navigation.
5. `#stage[data-mode]` reflects the current client-side mode (`pinned-journey` or `plain-flow`);
   `script.js` sets this attribute on load/resize and `styles.css` uses it (not JS inline styles)
   to toggle pinned-vs-flow CSS rules. This keeps mode-dependent styling declarative and testable
   by inspecting the attribute in a browser.
6. Every `<img class="scene__bg">` MUST have `width`, `height` (or CSS `aspect-ratio`) set inline
   or via a stylesheet rule keyed to its `id`, and a concrete Korean `alt` description — `script.js`
   waits on these images' `decode()`/`load` before calling `ScrollTrigger.refresh()` (research.md
   item 4).

## Non-goals

- No JSON/REST/GraphQL contract — there is no server.
- No build-time schema validation — this contract is verified manually via the `quickstart.md`
  checklist and by visual/DOM inspection in the browser devtools.
