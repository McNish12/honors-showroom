# Honors Showroom — Figma Design Plan (for Nik)

Goal: design the customer-facing Honors Showroom catalog first, then wireframe the upcoming admin tool. The live site is a static catalog fed by Google Sheets — everything below reflects what's actually built or planned in this repo.

## 1. Brand foundations (match what's live today)

Start the Figma file with a small styles/components page using these tokens from `styles/main.css`:

| Token | Value |
|---|---|
| Brand gold | `#F4A300` |
| Brand gold (dark/hover) | `#CC8700` |
| Text | `#212121` |
| Muted text | `#6B7280` |
| Background | `#FFFFFF` |
| Corner radius | 14px |
| Content max width | 1200px |

- **Headings:** Montserrat (600/700). **Body:** system UI stack (use Inter in Figma as the stand-in).
- **Logo:** `Assets/Honors/Honors Thick Logo.png` and `Honors Thick Logo Circle.png` in this repo.
- **Contact info shown on site:** sales@honorsone.com • 248.582.5200 • 997 Rochester Road, Suite A, Troy, MI 48083.

Build these as components before designing screens: button (primary/secondary), product card, search input, dropdown filter, tag chip, price table row, drawer shell.

## 2. Phase 1 — Customer catalog (high fidelity, do this first)

These screens exist today and are the redesign target. Frames at **1280 desktop** and **375 mobile** for each.

1. **Catalog home** (`index.html`)
   - Top contact bar (email • phone)
   - Header: logo + category nav links
   - Controls row: search box + three filter dropdowns (Category, Imprint Method, Tags) — *note: these exist in the markup but aren't functional yet, so design is free to rethink them*
   - Result count line + product card grid, grouped by category
2. **Product detail drawer** (slides over the catalog)
   - Hero image + thumbnail strip
   - Title, price (single, range, or "Quote Upon Request"), description
   - Imprint methods, tag chips, optional 3D preview link
   - Variant table: size/option + price rows
3. **Image lightbox** (fullscreen image view with close button)
4. **404 page** (simple, links back to catalog)

**States to cover:** loading, empty search results, product with no image, long product names, 1-variant vs many-variant tables.

## 3. Phase 2 — Admin MVP (wireframes are fine)

An internal Firebase-backed admin tool is planned (see `FIREBASE_ADMIN_PLAN.md`). Low-fidelity wireframes only — the workflow matters more than polish:

1. Admin sign-in
2. Product list (name, category, status, price range, stock, last updated)
3. Product edit (fields + gallery URLs + tags + status)
4. Variant editor (label, price, SKU, stock, active/hidden)
5. Customer request inbox (list + status + notes)
6. Google Sheets import preview ("here's what will be created/updated → confirm")

## 4. Phase 3 — Later (don't start yet)

- Customer quote/inquiry form with artwork upload
- Plaque verbiage collection ("what should the plaque say")
- Plaque designer concept

## 5. Working agreement

- One Figma file, pages: `01 Foundations`, `02 Catalog`, `03 Admin`, `04 Later`.
- Name frames by screen + state (e.g., `Catalog / Desktop / Empty search`).
- Use the color/text styles from Foundations everywhere so dev handoff maps cleanly to CSS variables.
- Share the file link with Andrew when Phase 1 catalog screens are ready for a first pass — don't wait for pixel-perfect.
