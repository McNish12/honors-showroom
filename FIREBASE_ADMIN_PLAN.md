# Firebase Admin MVP Plan

Reviewed on 2026-07-01 for the Honors Showroom ecommerce learning project.

## Guardrails

- Do not work directly on `main`.
- Do not change GitHub Pages settings.
- Do not replace the Google Sheet workflow yet.
- Do not set up billing, payments, checkout, or production Firebase.
- Do not connect this repo to Honors-OS unless Andrew explicitly asks.
- Treat Firebase as a learning/admin sandbox until the plan is reviewed and approved.

## Files Reviewed

- `README.md`
- `index.html`
- `scripts/catalog.js`
- `styles/main.css`
- `package.json`
- `AGENTS.md`

`START_HERE.md` and `FIREBASE_ADMIN_PLAN.md` were not present in this checkout before this plan was written.

## 1. How the Current Site Works

The current site is a static catalog. There is no build step and no backend in this repo.

- `index.html` is the main catalog page.
- The page loads `styles/main.css` for layout and visual styling.
- The page loads Papa Parse from a CDN.
- The page loads `scripts/catalog.js`, which fetches catalog data from two published Google Sheets CSV URLs.
- The browser builds the category navigation, product grid, product detail drawer, image gallery, lightbox, tags, preview link, and variant price table.
- Routing is hash-based:
  - `#/c/category-slug` filters the visible catalog by category.
  - `#/p/product-id` opens a product detail drawer.
- The search/filter controls in `index.html` exist in the markup, but the current `scripts/catalog.js` implementation does not wire them up yet.
- `preview-showroom.html` and `scripts/showroom.js` are a separate preview/sample-data path, not the current live Google Sheets catalog path.

## 2. Where Product Data Comes From

Product and variant data currently comes from published Google Sheets CSV endpoints hardcoded in `scripts/catalog.js`.

- `PRODUCTS_CSV` points to the published products sheet.
- `VARIANTS_CSV` points to the published variants sheet.
- The site fetches both URLs directly from the visitor's browser.
- The CSVs are parsed client-side with Papa Parse.
- No product data is stored in this repo except sample data in `scripts/showroom.js`.
- No Firebase data source exists in the current app.

## 3. Which Files Control the Catalog

- `index.html`
  - Defines the shell of the catalog page.
  - Contains the header, contact bar, controls, catalog container, product detail drawer, and footer.
  - Loads Papa Parse and `scripts/catalog.js`.

- `scripts/catalog.js`
  - Owns the live catalog data fetch.
  - Defines accepted product and variant column aliases.
  - Normalizes product IDs.
  - Filters approved products.
  - Joins variants to products.
  - Builds category navigation.
  - Renders product cards and detail drawers.

- `styles/main.css`
  - Controls the visual design, responsive grid, header, controls, product cards, detail drawer, variant table, footer, and lightbox styles.

- `package.json`
  - Provides a lightweight static-server command with `http-server`.
  - Does not currently provide a real build, lint, or test workflow.

## 4. Google Sheets Data Flow Into the Site

Current flow:

1. A visitor opens `index.html`.
2. The browser loads Papa Parse from `cdn.jsdelivr.net`.
3. The browser loads `scripts/catalog.js`.
4. `scripts/catalog.js` fetches the products CSV and variants CSV with `cache: 'no-store'`.
5. Papa Parse converts each CSV into rows keyed by header names.
6. Empty rows are removed.
7. Product fields are read through the `PRODUCT_COLS` alias map.
8. Variant fields are read through the `VARIANT_COLS` alias map.
9. Variant rows are grouped by normalized product ID.
10. Product rows are filtered to records where `Status` is `approved` or `Approved` is `true`.
11. Each product is converted into a catalog object with:
    - `id`
    - `name`
    - `category`
    - `preview`
    - `thumb`
    - `description`
    - `gallery`
    - `imprint`
    - `tags`
    - `variants`
    - `minPrice`
    - `maxPrice`
12. Categories are derived from the product rows and rendered into the nav.
13. Product cards are grouped by category and displayed in the catalog grid.
14. Opening a product uses the same in-memory catalog object to render details, images, tags, preview link, and variants.

Current product sheet fields supported by aliases:

- Status or Approval Status
- Slug or Product ID
- Product Name or Name or Item Name
- Category
- Preview or 3D Preview URL
- Thumbnail URL or Image URL
- Description
- Gallery URLs
- Imprint Methods
- Tags
- Approved

Current variant sheet fields supported by aliases:

- Product ID or Slug
- Size or Option or Variant or Spec
- Price or Unit Price or Cost

## 5. What Would Need to Change to Move Product Data Into Firebase

Firebase should be introduced as a parallel sandbox data source first. The Google Sheet should remain the current workflow until Andrew approves a cutover.

Recommended migration path:

1. Create a dev-only Firebase project after explicit approval.
2. Add Firebase config only for the dev/sandbox project.
3. Add Firebase Auth for admin-only access.
4. Add Firestore collections for products, variants, customer requests, artwork/verbiage, and admin users.
5. Add Firebase Storage for product images and customer artwork files only after the upload rules are designed.
6. Create an import/sync script or admin action that reads the current published CSV data and writes it into the dev Firestore schema.
7. Keep the public catalog reading from Google Sheets while the admin MVP is tested.
8. Add a catalog data adapter so the UI can eventually load from either Google Sheets or Firebase without rewriting the whole page.
9. Add security rules before any customer-facing or admin-facing write path is enabled.
10. Add export/backout options so Firebase data can be reviewed or restored without relying on manual console edits.

Important: the first Firebase work should not be a public cutover. It should prove that the same product and variant shape can be mirrored from Google Sheets into a safe sandbox.

## 6. Proposed Firebase Data Model

Use Firestore for structured records and Firebase Storage for uploaded files.

### `products/{productId}`

Purpose: public catalog product record plus admin-managed merchandising fields.

Suggested fields:

- `slug`
- `name`
- `status`: `draft`, `approved`, `published`, `archived`
- `category`
- `description`
- `thumbnailUrl`
- `galleryUrls`
- `previewUrl`
- `imprintMethods`
- `tags`
- `sortOrder`
- `source`: `google_sheet`, `firebase_admin`, `manual_import`
- `sourceSheetRowId`
- `pricingMode`: `fixed`, `range`, `quote`
- `minPrice`
- `maxPrice`
- `stockMode`: `not_tracked`, `tracked`, `manual_sell_down`
- `createdAt`
- `updatedAt`
- `publishedAt`
- `updatedBy`

### `products/{productId}/variants/{variantId}`

Purpose: product options, sizes, price rows, and stock values.

Suggested fields:

- `label`
- `sku`
- `size`
- `price`
- `unitCost`
- `stockQuantity`
- `reservedQuantity`
- `availableQuantity`
- `stockStatus`: `in_stock`, `low_stock`, `sold_out`, `not_tracked`
- `status`: `active`, `hidden`, `archived`
- `sortOrder`
- `sourceSheetRowId`
- `createdAt`
- `updatedAt`
- `updatedBy`

### `customerRequests/{requestId}`

Purpose: quote, product inquiry, artwork/verbiage collection, or future designer request.

Suggested fields:

- `type`: `product_inquiry`, `quote_request`, `artwork_submission`, `plaque_design_request`
- `status`: `new`, `reviewing`, `needs_customer_info`, `ready_for_quote`, `quoted`, `closed`
- `customerName`
- `customerEmail`
- `customerPhone`
- `organization`
- `productId`
- `variantId`
- `quantity`
- `neededByDate`
- `customerNotes`
- `internalNotes`
- `sourcePage`
- `assignedAdminUid`
- `createdAt`
- `updatedAt`
- `closedAt`

### `customerRequests/{requestId}/artworkFiles/{fileId}`

Purpose: artwork upload metadata. Actual files should live in Firebase Storage.

Suggested fields:

- `storagePath`
- `downloadUrl`
- `originalFileName`
- `contentType`
- `sizeBytes`
- `uploadedBy`: `customer`, `admin`
- `status`: `uploaded`, `needs_review`, `approved`, `rejected`
- `reviewNotes`
- `createdAt`
- `reviewedAt`

### `customerRequests/{requestId}/verbiage/{verbiageId}`

Purpose: structured customer wording for plaques, awards, engraving, and proofing.

Suggested fields:

- `title`
- `lines`
- `recipientName`
- `organization`
- `eventName`
- `dateText`
- `message`
- `specialInstructions`
- `status`: `draft`, `submitted`, `needs_revision`, `approved`
- `createdAt`
- `updatedAt`
- `approvedAt`

### `adminUsers/{uid}`

Purpose: admin identity, role, and access status.

Suggested fields:

- `email`
- `displayName`
- `role`: `owner`, `admin`, `editor`, `viewer`
- `status`: `active`, `disabled`
- `permissions`
- `createdAt`
- `updatedAt`
- `lastLoginAt`

Only Andrew should decide who gets admin access and which role they receive.

### Optional Later Collections

- `inventoryEvents/{eventId}` for stock adjustments and audit history.
- `productImports/{importId}` for Google Sheet import runs.
- `adminAuditLogs/{logId}` for sensitive admin changes.
- `plaqueDesigns/{designId}` for saved Honors Plaques designer drafts.

## 7. First Admin Page MVP

The first admin page should be small and useful. It should prove admin editing without replacing the public catalog.

Recommended MVP:

- Admin sign-in with Firebase Auth against a dev-only Firebase project.
- Product list view:
  - product name
  - category
  - status
  - min/max price
  - stock mode or simple stock status
  - last updated
- Product detail/edit view:
  - name
  - category
  - description
  - thumbnail URL
  - gallery URLs
  - tags
  - imprint methods
  - status
- Variant editor:
  - label or size
  - price
  - SKU if known
  - simple stock quantity
  - active/hidden status
- Customer request inbox:
  - read-only list at first, or manual create-only if public forms are not ready.
  - status and notes fields for learning workflow.
- Import preview from Google Sheets:
  - show what products/variants would be created or updated.
  - require a manual confirm before writing to Firebase.

The MVP should not change the public `index.html` data source until Andrew reviews the admin workflow.

## 8. What Should Stay Manual For Now

- Publishing products to the live catalog.
- Deciding which products are approved.
- Final pricing decisions.
- Quote creation and customer follow-up.
- Artwork review and quality checks.
- Proof creation and proof approval.
- Stock reconciliation.
- Admin user approval.
- Any connection to Honors-OS.
- Any GitHub Pages setting changes or deployments.

## 9. What Should Not Be Built Yet

Do not build these in the first admin MVP:

- Payments.
- Checkout.
- Tax, shipping, or order total calculations.
- Live inventory decrementing from customer purchases.
- Customer accounts.
- Production Firebase setup.
- Billing-enabled Firebase services.
- Automated order creation in Honors-OS.
- AI shopping assistant actions that write to product, inventory, or customer records.
- Full Honors Plaques designer with production artwork output.
- Public file upload without security rules, file validation, and a storage review plan.

For the learning project, customer-facing requests can start as inquiry/quote collection, not checkout.

## 10. Open Questions for Andrew

1. Should Firebase become the future source of truth, or should it stay a mirror/admin experiment while Google Sheets remains the source of truth?
2. Should the first Firebase project be a new sandbox project with no production data?
3. Which page is the canonical public catalog: `index.html` or `preview-showroom.html`?
4. What product ID should be considered stable: sheet slug, product ID, SKU, or a new Firebase ID?
5. What does "stock" mean for this project: exact on-hand inventory, sell-down quantity, or rough availability?
6. Should stock be tracked per product or per variant?
7. Which product fields are required before a product can be published?
8. Who should be allowed to sign into the admin MVP?
9. What roles are needed besides Andrew as owner?
10. What customer request types should be collected first: quote request, artwork upload, verbiage, or plaque designer draft?
11. What file types and file sizes should be accepted for customer artwork?
12. Should customer requests send email notifications? If yes, to which address?
13. Should pricing be shown publicly when available, or should more products say "Quote Upon Request"?
14. Should Firebase-hosted product images replace current external image URLs later?
15. What is the smallest useful Honors Plaques designer: text/verbiage collection, simple preview, or configurable product proof?
16. Does any data from this repo need to flow into Honors-OS later, or should it stay separate until a future explicit integration plan?

## 11. Recommended First Build Step After Approval

After Andrew approves this plan, the first build step should be:

Build a dev-only Firebase mirror prototype on a new branch.

That step should:

- Use a sandbox Firebase project only after explicit approval.
- Keep the public catalog on Google Sheets.
- Add a small catalog data contract for the current product and variant shape.
- Add an import/preview path that reads the current Google Sheets CSVs and shows the Firebase documents it would create.
- Write to Firebase only after manual confirmation.
- Add basic admin sign-in and a product list view.

This keeps the first build focused on learning product management and stock/admin workflows without taking on checkout, payments, production Firebase, or a live catalog migration.
