# Contract: CREDITS.md Row Format

Fixes the record format so every image asset added to `assets/images/` has a matching, verifiable
entry, satisfying constitution Principle VI and spec FR-016.

## Required table (one row per image file)

```markdown
| 파일 경로 | 작가/제공 | 출처 URL | 라이선스 | 확인 날짜 |
|---|---|---|---|---|
| `./assets/images/hero-korea.webp` | [Author Name] | https://... (원본 상세 페이지) | CC BY 4.0 | 2026-09-09 |
```

## Rules

1. One row per file that exists under `assets/images/` — no row without a corresponding file, no
   file without a corresponding row (checked manually in `quickstart.md`).
2. `출처 URL` MUST be the original detail/attribution page (Wikimedia Commons file page, Unsplash
   photo page, Pexels photo page), never a search-results page, thumbnail CDN URL, or a page the
   image was merely embedded in.
3. `라이선스` MUST name a license that explicitly permits commercial use and derivative works
   (resize/crop/format conversion) — e.g. `CC0 1.0`, `CC BY 2.0/3.0/4.0`, `CC BY-SA 3.0/4.0`,
   `Unsplash License`, `Pexels License`. A row naming an editorial-only or no-derivatives license is
   a contract violation and that image must not ship.
4. `확인 날짜` is the date the author/license was verified on the source page, in `YYYY-MM-DD`.
5. File name stems in `파일 경로` match the Place/Hero `id` (e.g. `seoraksan.webp`,
   `hero-korea.webp`) per data-model.md's Image entity.
