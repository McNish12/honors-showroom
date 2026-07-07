# Codex Instructions for Honors Showroom

## Project Boundary

- This repository is `honors-showroom`.
- Treat it as an experimental ecommerce, inventory sell-down, customer buying flow, and AI shopping assistant sandbox.
- This repository is not Honors-OS.
- Honors-OS is for internal operations, jobs, CRM, quotes, and production workflow.
- Do not merge Honors Showroom and Honors-OS contexts, data models, workflows, or deployment assumptions unless Andrew explicitly asks for that.
- If a request seems to connect this repo to Honors-OS, pause and confirm the intended boundary before designing or implementing that connection.

## Operating Rules

- Keep changes on a branch unless Andrew says otherwise. If you are on `main`, create a `codex/...` branch before editing.
- Do not touch production Firebase, billing, secrets, or deployments without explicit approval.
- Do not add or rotate secrets, change live Firebase projects, edit billing settings, or publish deployments as part of routine repo work.
- Start by reviewing the actual files in this repo before proposing or editing.
- Prefer small, reversible changes that fit the current static-site shape of the project.
- Do not assume this repo has the same architecture, data ownership, or release process as Honors-OS.

## Current Structure

Reviewed on 2026-07-01.

- `README.md` describes a static catalog that can be opened directly or served with a lightweight static server.
- `index.html` is the main static catalog entry point. It loads `styles/main.css`, Papa Parse from a CDN, and `scripts/catalog.js`.
- `scripts/catalog.js` fetches published Google Sheets CSVs for products and variants, filters approved products, builds category navigation, renders product cards, and opens a detail drawer with gallery, tags, preview links, and variant pricing.
- `styles/main.css` holds the shared catalog layout, cards, drawer, footer, responsive rules, and lightbox styling.
- `preview-showroom.html` is a separate Honors Showroom preview page that loads `scripts/showroom.js`.
- `scripts/showroom.js` uses in-file sample products and renders a showroom-style product drawer, gallery, template links, and 3D preview links.
- `scripts/index.html` is a minimal alternate catalog entry inside the scripts folder. It tries to import `catalog.js` and falls back to `showroom.js`.
- `preview.html` still references a removed `theme/` directory and appears to be an older Rocket Catalog theme preview.
- `404.html` is a simple static not-found page.
- `Assets/` contains Honors logo files and product imagery used by the static pages.
- `package.json` has a `start` script using `http-server` and a placeholder `test` script.
- `.github/workflows/release-theme.yml.txt` is tracked as a text file and references a missing `theme/` directory, so it looks like legacy release documentation rather than an active workflow.

## Known Risks

- There are two product-rendering paths: `scripts/catalog.js` uses live published CSVs, while `scripts/showroom.js` uses sample data. These can drift if features are added to only one path.
- The main catalog depends on externally published Google Sheets CSV URLs and Papa Parse from a CDN. If those sources, headers, or network access change, the catalog can fail at runtime.
- CSV schema handling is flexible but lightly validated. Header changes may only surface as browser console warnings or empty catalog states.
- `preview.html` references files under `theme/assets/`, but the README says the `theme/` directory was removed. Treat that page as stale unless Andrew asks to restore the theme preview.
- `.github/workflows/release-theme.yml.txt` references the removed `theme/` directory. Do not reactivate or rename it into a live workflow without confirming the current deployment plan.
- There is no real automated test suite yet; `npm test` is a placeholder.
- The local `start` script uses shell-style port substitution, which may not behave consistently across Windows shells.
- This repo currently appears static-only. Do not infer an approved Firebase, checkout, order ingest, payment, or AI assistant backend from these files.

## Recommended Next Steps

- Decide which page is canonical for ongoing showroom work: `index.html` with live CSVs, or `preview-showroom.html` with the sample-data showroom flow.
- Either remove, fix, or clearly archive stale theme-era files such as `preview.html` and `.github/workflows/release-theme.yml.txt`.
- Add a small smoke test or validation script that confirms the main page loads, required DOM nodes exist, and CSV header assumptions are still satisfied.
- Create a documented product data contract for the published sheet fields used by `scripts/catalog.js`.
- Add a local fixture mode for development so UI work does not require the live published Google Sheet.
- Before adding cart, checkout, inventory sell-down, Firebase, or AI shopping assistant features, write the proposed boundary and data flow first and get explicit approval for any production service touchpoints.
