# Implementation Plan: 한국의 결 (Landscapes of Korea)

**Branch**: `001-korea-nature-landscapes` | **Date**: 2026-09-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-korea-nature-landscapes/spec.md`

## Summary

단일 HTML 문서로 구성된 편집형 문화관광 사이트를 빌드 과정 없이 순수 정적 파일(HTML/CSS/Vanilla JS)로 구현한다.
GSAP + ScrollTrigger로 전체 여정(Hero → 설악산 → 제주 → 순천만 → 보성 녹차밭 → CTA)을 감싸는 **하나의 pinned
stage**와 **하나의 master timeline**을 만들어, 장면 사이가 이미지 스케일-업 / cross-fade / 텍스트 시차 등장으로
연속적으로 이어지는 "tunnel" 전환을 구현한다. 768px 미만 뷰포트와 `prefers-reduced-motion`에서는 pin과
scrub 애니메이션을 완전히 비활성화하고 일반 세로 스크롤 문서로 폴백한다. 이미지는 구현 초기 단계에 실제
온라인 사진(상업적 이용·변형 허용 라이선스)을 검색해 `assets/images/`에 로컬 다운로드하고, 모든 출처를
`CREDITS.md`에 기록한다.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES2020+, no transpilation target beyond evergreen browsers)

**Primary Dependencies**: GSAP core + ScrollTrigger plugin (loaded via versioned CDN `<script>` tag, no bundler/package manager); Google Fonts (Inter, open-source, as the legally usable stand-in for DESIGN.md's proprietary GT Walsheim)

**Storage**: N/A — no database, no server-side storage; all content is static HTML and local image files

**Testing**: Manual browser verification (desktop scroll behavior, mobile fallback, `prefers-reduced-motion`, keyboard navigation, resize behavior, subpath deployment check) driven by `quickstart.md`; no automated test framework given the project's static-content nature

**Target Platform**: Evergreen desktop and mobile browsers (Chrome, Safari, Firefox, Edge — last 2 versions), served as static files from GitHub Pages (including project subpaths, e.g. `username.github.io/korea-nature/`)

**Project Type**: Single static web page (no frontend/backend split, no build step)

**Performance Goals**: 60fps scroll-driven animation on mid-range laptops/desktops by restricting animated properties to `transform`/`opacity`; first meaningful content (Hero text) visible before all images finish loading

**Constraints**: Zero build step (files must run as-is when opened via a static file server); no CSS scroll-snap; no wheel-event interception or forced `scrollTo`; single ScrollTrigger pin for the whole journey (not one pin per section); relative asset paths only (`./assets/...`, never `/assets/...`); `prefers-reduced-motion` must fully disable pin/scrub choreography

**Scale/Scope**: 1 HTML page, 6 scenes (Hero + 4 places + CTA/footer), ~5 images, no routing, no dynamic data

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|---|---|---|
| I. Static Single-Page Scope | Plan uses only static HTML/CSS/JS + CDN-loaded GSAP; no login/server/DB/API | PASS |
| II. DESIGN.md as Visual Source of Truth | Plan reuses DESIGN.md's color/typography/spacing/radius tokens (dark canvas, white display type, accent-blue links, surface lift system) reinterpreted for nature-tourism content; DESIGN.md itself is only read | PASS |
| III. Portable Relative Paths | All asset/image references use `./assets/...`; no root-absolute paths | PASS |
| IV. Semantic HTML & Accessibility | Plan specifies semantic elements (`header`, `main`, `section`, `figure`, `footer`), keyboard-operable CTA, and full `prefers-reduced-motion` fallback | PASS |
| V. Real Content Over Photo Dump | Plan embeds the full Hero lead + 2 body paragraphs per place from spec.md verbatim, styled as independent readable panels (17-20px, 1.65-1.85 line-height, 36-48rem width) | PASS |
| VI. Authentic, Rights-Cleared Imagery | Plan includes an explicit Phase 0/early-implementation image-sourcing step (search → verify commercial+derivative-safe license → download → record in CREDITS.md); no placeholders permitted | PASS |
| VII. Continuous Desktop Scroll, Simple Mobile Fallback | Plan uses one master ScrollTrigger timeline (no per-section pins, no scroll-snap, no forced scrollTo) on desktop, and an unpinned normal document flow below 768px | PASS |

No violations. Complexity Tracking section is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-korea-nature-landscapes/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
index.html              # Single page: Hero, 4 place sections, CTA/footer — all markup and copy
styles.css              # All styling: DESIGN.md-derived tokens, layout, typography, reduced-motion overrides
script.js               # GSAP + ScrollTrigger setup: master timeline, pin, mobile/reduced-motion fallback, resize + load handling
DESIGN.md                # Existing — read-only visual reference, not modified
CREDITS.md              # New — image sourcing record (path, author, source URL, license, verified date)
.nojekyll               # New — empty marker file so GitHub Pages serves the repo as-is (no Jekyll processing)
assets/
└── images/
    ├── hero-korea.webp       # (or .jpg if license/quality requires — see research.md)
    ├── seoraksan.webp
    ├── jeju.webp
    ├── suncheon-bay.webp
    └── boseong-tea-fields.webp
```

**Structure Decision**: Flat single-project static site at the repository root, exactly matching the file
list mandated by the user (`index.html`, `styles.css`, `script.js`, `DESIGN.md`, `CREDITS.md`, `.nojekyll`,
`assets/images/`). No `src/`, no framework scaffolding, no backend directory — this is the only structure
option applicable given Constitution Principle I (static single-page scope) and the explicit "no build
process" requirement.

## Complexity Tracking

*No constitution violations — this section is intentionally empty.*
