<!--
Sync Impact Report
- Version change: (none) → 1.0.0
- Modified principles: n/a (initial ratification)
- Added sections: I. Static Single-Page Scope, II. DESIGN.md as Visual Source of Truth,
  III. Portable Relative Paths, IV. Semantic HTML & Accessibility, V. Real Content Over Photo Dump,
  VI. Authentic, Rights-Cleared Imagery, VII. Continuous Desktop Scroll / Simple Mobile Fallback;
  Additional Constraints; Development Workflow; Governance
- Removed sections: none
- Follow-up TODOs: none
-->

# Korea Nature Constitution

## Core Principles

### I. Static Single-Page Scope
The project is a single-page static website introducing the beauty of Korea's nature.
No login, authentication, server, database, or API backend MAY be built or introduced.
Everything MUST run as static HTML/CSS/JS servable from a file host with no backend process.

**Rationale**: Keeps the project simple, dependency-free, and trivially deployable as a
static site with no attack surface or infrastructure to maintain.

### II. DESIGN.md as Visual Source of Truth
The root `DESIGN.md` file is the highest-priority visual reference for all UI decisions
(layout, color, typography, spacing, tone). Any UI choice MUST be checked against it first.
The original `DESIGN.md` file itself MUST NOT be modified during implementation.

**Rationale**: `DESIGN.md` acts as an immutable design contract; treating it as read-only
prevents drift between the agreed design intent and ad-hoc implementation edits.

### III. Portable Relative Paths
All page and image paths MUST be relative so the site works unmodified when deployed to a
GitHub Pages project subpath (e.g., `username.github.io/repo/`). Absolute root-relative
paths (`/images/...`) or environment-specific base URLs MUST NOT be used.

**Rationale**: GitHub Project Pages serve from a subpath, not the domain root; relative
paths are the only way to guarantee working links and images post-deployment.

### IV. Semantic HTML & Accessibility
Markup MUST use semantic HTML elements (e.g., `header`, `nav`, `main`, `section`, `figure`,
`footer`) appropriate to content meaning, and all interactive elements MUST be reachable and
operable via keyboard. Any animation or scroll-driven effect MUST respect
`prefers-reduced-motion`, degrading to a static or minimally-animated presentation so content
remains fully readable without motion.

**Rationale**: Accessibility is non-negotiable baseline quality, not an enhancement, and
respecting reduced-motion preferences avoids harming users sensitive to motion.

### V. Real Content Over Photo Dump
The site MUST NOT be a bare photo gallery. It MUST include a written hero lead paragraph and,
for each featured place, two real body paragraphs of substantive content. Body text MUST be
treated as an independent design element with readable font size and line-height — not shrunk
into a small caption overlaid on a photo.

**Rationale**: The project's purpose is to introduce Korea's nature meaningfully, which
requires real narrative content, not just images, and requires that content actually be legible.

### VI. Authentic, Rights-Cleared Imagery
Real photographs of Seoraksan, Jeju, Suncheon Bay, and the Boseong green tea fields MUST be
sourced online and downloaded into the project during implementation. Only images whose reuse
terms can be verified MAY be used. Placeholder images, arbitrary solid-color boxes, and
external image hotlinking MUST NOT remain in the final result. Every image file's source,
photographer/author, original URL, and license MUST be recorded in `CREDITS.md`.

**Rationale**: Using real, verifiably licensed photography with proper attribution avoids
copyright risk and placeholder-quality output, and keeps provenance auditable.

### VII. Continuous Desktop Scroll, Simple Mobile Fallback
On desktop, the site MAY use strong scroll-driven interaction between scenes, but transitions
MUST feel continuous — no jarring cuts or forced/hijacked jumps between sections. On mobile,
the experience MAY fall back to a normal, easy-to-read vertical flow with simple transitions
rather than replicating the desktop scroll interaction.

**Rationale**: Desktop scroll storytelling can showcase the content richly, but forcing the
same complex interaction onto mobile hurts readability and usability where it matters most.

## Additional Constraints

- No unnecessary frameworks, build tooling, or server-side dependencies MAY be added; prefer
  plain HTML/CSS/JS unless a specific, justified need arises.
- The final deliverable MUST be structured for direct deployment on GitHub Pages with no build
  step required beyond what is committed (or, if a build step exists, its static output MUST be
  what is deployed).

## Development Workflow

- Before implementing UI, consult `DESIGN.md` for visual direction; do not edit that file.
- When adding any image asset, immediately record its source, author, URL, and license in
  `CREDITS.md` in the same change.
- Verify keyboard navigation and `prefers-reduced-motion` behavior, and verify relative-path
  correctness (e.g., by testing under a non-root subpath), before considering a UI change done.

## Governance

This constitution supersedes other informal practices for this project. Amendments require
updating this file with a documented rationale and a version bump following semantic
versioning: MAJOR for incompatible governance/principle removals or redefinitions, MINOR for
new principles or materially expanded guidance, PATCH for clarifications and wording fixes.
All feature work MUST be checked against this constitution; any deviation MUST be justified
explicitly in the relevant spec or plan before proceeding.

**Version**: 1.0.0 | **Ratified**: 2026-09-09 | **Last Amended**: 2026-09-09
