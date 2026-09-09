# Phase 1 Data Model: 한국의 결 (Landscapes of Korea)

This project has no database or runtime data layer — "entities" here are the structured content
units embedded directly as static HTML markup in `index.html`. This document defines their shape so
markup stays consistent across all four place sections and so `tasks.md` can be scoped precisely.

## Entity: Place

Represents one of the four featured natural landmarks. Rendered as one `<section>` in `index.html`
and one corresponding scene block in `script.js`'s scene registry.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string (slug) | yes | One of `seoraksan`, `jeju`, `suncheon-bay`, `boseong-tea-fields`; used as section `id`, image filename stem, and `data-scene` attribute |
| `nameKo` | string | yes | Korean place name (e.g., "설악산") |
| `nameEn` | string | yes | English/romanized name, upper case per spec (e.g., "SEORAKSAN") |
| `tagline` | string | yes | The one-line "풍경의 성격을 짚는" title, exact spec.md copy |
| `bodyParagraph1` | string (rich text) | yes | Exact spec.md copy, no truncation |
| `bodyParagraph2` | string (rich text) | yes | Exact spec.md copy, no truncation, different length than paragraph1 |
| `keywords` | string[2..3] | yes | Short keyword/info fragments, exact spec.md copy |
| `image` | Image (see below) | yes | The near-full-screen representative photo |
| `layoutVariant` | enum: `image-left` \| `image-right` \| `panel-overlay` | yes | Drives per-place left/right/overlay rhythm (FR-006); must not repeat identically across all 4 places |

Validation rules (derived from spec FR-003, FR-004, FR-006):
- `bodyParagraph1` and `bodyParagraph2` must be non-empty and must differ in character length from
  each other (spec requires "서로 다른 길이").
- `keywords.length` must be 2 or 3.
- Across the 4 Place records, `layoutVariant` (and associated spacing/alignment) must not be
  identical for every entry — at minimum image-left/image-right must alternate, and at least one
  place should use the translucent reading-panel treatment.

## Entity: HeroContent

Singleton — the page-opening scene.

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Fixed: "한국의 결" |
| `titleEn` | string | yes | Fixed: "LANDSCAPES OF KOREA" |
| `lead` | string (rich text) | yes | Fixed lead paragraph, exact spec.md copy, not shortened |
| `image` | Image | yes | Hero background/representative photo |

## Entity: ClosingCTA

Singleton — the final scene before the footer.

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Fixed: "오래 보고 싶은 풍경은 천천히 남습니다" |
| `body` | string | yes | Fixed closing sentence, exact spec.md copy |
| `buttonLabel` | string | yes | Fixed: "처음 풍경부터 다시 보기" |
| `buttonAction` | enum: `scroll-to-top` | yes | Same-page scroll to Hero; no navigation |

## Entity: Image

Represents one locally-hosted photo asset and its provenance record. One instance per Hero + per
Place (5 total minimum).

| Field | Type | Required | Notes |
|---|---|---|---|
| `path` | string (relative URL) | yes | e.g. `./assets/images/seoraksan.webp`; never root-absolute, never an external URL |
| `alt` | string (Korean) | yes | Concrete description of what's visible in the photo (FR-017) — not a repeat of the tagline |
| `width` / `height` or `aspectRatio` | number / number or CSS ratio | yes | Set on the `<img>`/CSS to prevent layout shift while loading |
| `credit` | Credit (see below) | yes | Must have a matching row in `CREDITS.md` |

## Entity: Credit (CREDITS.md row)

One row per Image, stored in `CREDITS.md`, not in HTML.

| Field | Type | Required | Notes |
|---|---|---|---|
| `filePath` | string | yes | Matches `Image.path` exactly |
| `author` | string | yes | Photographer or contributing institution name as credited on the source page |
| `sourceUrl` | string (absolute URL) | yes | The original detail page (not a thumbnail/CDN URL) |
| `license` | string | yes | Must permit commercial use + derivatives (e.g., CC0, CC-BY 2.0/3.0/4.0, CC-BY-SA, Unsplash License, Pexels License) |
| `verifiedDate` | date (YYYY-MM-DD) | yes | Date the license/author was checked on the source page |

## Relationships

- `HeroContent` has exactly one `Image`.
- Each `Place` has exactly one `Image`.
- Each `Image` has exactly one `Credit` entry in `CREDITS.md`.
- `Place` records are ordered: `seoraksan` → `jeju` → `suncheon-bay` → `boseong-tea-fields` (fixed
  page order per spec FR-001); this order is encoded as DOM order in `index.html` and as the scene
  sequence array in `script.js`.

## State / Mode (client-side only, not persisted)

No server-persisted state exists. The only runtime "state" is a client-side rendering mode derived
from environment, not user data:

| Mode | Trigger | Behavior |
|---|---|---|
| `pinned-journey` (default desktop) | viewport width ≥ 768px AND `prefers-reduced-motion` is not `reduce` | Single ScrollTrigger pin + master timeline choreography |
| `plain-flow` | viewport width < 768px OR `prefers-reduced-motion: reduce` | Unpinned normal vertical document, simple per-section reveal, full text always present |

This mode is recomputed on load and on debounced resize (see research.md item 3); it is never
written to storage and carries no user-identifying data.
