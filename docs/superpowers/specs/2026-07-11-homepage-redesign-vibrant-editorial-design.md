# Homepage Redesign — "Vibrant Editorial"

## Context

Current homepage (`index.html` / `ms/index.html`) is a generic long-scroll DTC template: blob decorations,
glassmorphism cards, small horizontal product carousel, pinned scroll-hijacked "Acacia story" section, Halal
trust badge buried mid-page. User wants a full visual + structural redesign — "impress me, shock me, be
creative" — while keeping the same AOS scroll-reveal animation library, staying mobile-friendly, and shipping
identically to both language versions.

Branch: `redesign-homepage` (isolated from `main` — full revert = `git checkout main`).
Safety checkpoint before this work: commit `21b0540` on `main`.

## Decisions from brainstorming

- **Scope**: homepage only (`index.html` + `ms/index.html`). Blog pages/articles untouched.
- **Restructure freedom**: full — section order, layout patterns, and copy can all change, not just visual skin.
- **Interaction mechanics**: free to redesign/replace. The pinned scroll-hijack Acacia story, drag carousel, blob
  hero shapes, sticky CTA, and retail modal are all fair game to reinvent — AOS fade/reveal animations are the
  one required constant.
- **Palette**: keep the existing brand palette (deep purple `#2D294E`, green `#7FBC3B`, orange/pink/red accents)
  as the foundation; elevate typography, layout, spacing, and imagery treatment dramatically around it.
- **Direction**: "Vibrant Editorial" — hybrid of premium editorial (oversized type, generous whitespace,
  asymmetric layout) and vibrant maximalist (5-flavour color system used as real design system, pushed-further
  organic motion). Narrative arc: origin story → daily ritual → trust (Halal) → flavour proof → purchase.

## New section structure

1. **Nav** — same links/lang-switch, bolder CTA button, refined scroll-state transition (kept from current).
2. **Hero** — oversized editorial headline, large hero product shot, dynamic flavour-color gradient background,
   trust strip immediately under the fold (Halal badge + "5 Flavours" + "Made for Malaysia" pills). Fixes the
   current gap where Halal trust is buried mid-page despite being a top purchase driver for this market.
3. **Origin story** — replaces the pinned scroll-hijack mechanic (heavy on mobile, accessibility-unfriendly —
   a real structural gap, not just cosmetic) with an asymmetric alternating-block narrative using AOS
   `fade-up`/`fade-left`/`fade-right` reveals, no scroll-jacking, no pinned viewport.
4. **Benefits** — bolder stat-card grid, each card tied to one of the flavour accent colors.
5. **Flavour showcase** — elevated from the small horizontal carousel into full color-blocked gallery cards;
   still horizontally scrollable/swipeable on mobile via native CSS scroll-snap (replacing the custom drag-JS
   carousel with a lighter, more robust mechanic).
6. **Halal & Malaysia trust section** — promoted to its own full section: JAKIM cert badge, "Halal-certified for
   Malaysia" framing, retail/wholesale trust signals.
7. **Wholesale** — same form and fields (untouched functionally), premium editorial two-column layout.
8. **FAQ** — same tab-switch mechanic (retail/wholesale tabs, accordion items), restyled visually only.
9. **Final CTA** — bold full-bleed closing statement with dual CTA buttons.
10. **Footer** — restyled, all existing links/lang-switch/social/contact/blog-link preserved functionally.

## Technical approach

- All reveal animation continues to use the AOS library exactly as today (`data-aos` attributes +
  `AOS.init()`) — no new animation library introduced.
- Retail modal (TikTok Shop / Shopee choice popup) stays functionally identical — only restyled.
- Wholesale form fields, `name` attributes, and validation stay identical — only restyled — since form
  submission logic in `main.js` depends on them.
- Scroll-hijack Acacia story JS and old drag-based carousel JS are removed from `main.js`; replaced with
  simpler, lighter interaction code (CSS scroll-snap for flavour gallery, plain AOS-driven reveals for the
  origin story — no custom scroll-position math).
- `index.html` and `ms/index.html` are rebuilt in parallel, section-for-section, so structure stays identical
  and only copy/language differs — same pattern used for the rest of the bilingual site.
- CSS changes land in `src/style.css` (same file, existing sections replaced/extended — no new stylesheet
  file, to avoid asset-loading changes).
- Mobile-first verification at 375px per project convention (`feedback_css_grid_flex_overflow` pattern —
  grid/flex items need `min-width: 0` safeguards).

## Explicitly out of scope

- Blog listing/article pages (`blog.html`, `ms/blog.html`, article pages) — untouched.
- Retail/wholesale link destinations — still placeholders (`#todo-shopee-my` etc.), unchanged from earlier work.
- Any deploy/push — local-only, same as all prior work on this project.

## Verification

- `vite dev` serves both `/` and `/ms/` at 200 with the new structure.
- AOS reveal animations fire correctly on scroll for both language versions.
- Retail modal opens/closes and wholesale form still submits (same JS hooks preserved).
- Mobile check at 375px width — no horizontal overflow, flavour gallery scroll-snaps correctly.
- Visual parity check between EN and BM versions — same structure, only text differs.
