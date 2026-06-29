# Firebase Admin Plan

Owner: Nik
Branch: `firebase-admin-mvp`
Status: Planning first, building second

## Purpose

We are turning the current Honors Showroom catalog into an ecommerce learning project. The first goal is to understand the existing site, document how it works, and plan a small Firebase-backed admin MVP before writing application code.

This branch is the sandbox for exploration. `main` should remain the stable reference version of the current catalog.

## Current Site Overview

Fill this in after reviewing the repo.

Questions to answer:
- What pages exist?
- What does the customer currently see?
- What actions can a customer take today?
- What parts are static HTML/CSS/JS?
- What parts depend on outside services?

## Current Product Data Source

Fill this in after reviewing the data flow.

Questions to answer:
- Where does product data come from today?
- Which Google Sheet tabs or published CSV URLs are used?
- What fields exist for products?
- What fields exist for variants/pricing?
- What data is missing for ecommerce, stock, customization, or artwork collection?

## Catalog Files

Read these files first:

- `README.md`
- `index.html`
- `scripts/catalog.js`
- `styles/main.css`
- `package.json`

Document what each file controls:

| File | Purpose | Notes |
| --- | --- | --- |
| `index.html` |  |  |
| `scripts/catalog.js` |  |  |
| `styles/main.css` |  |  |
| `README.md` |  |  |
| `package.json` |  |  |

## Google Sheets To Firebase Migration

Describe a practical migration path.

Topics to cover:
- What should stay in Google Sheets during the MVP?
- What should move to Firebase first?
- How should we import existing product rows?
- How do we avoid losing the existing sheet-backed catalog as a reference?
- What should the rollback plan be?

## Proposed Firebase Data Model

Draft collections and fields here.

Suggested starting collections:

### `products`

Potential fields:
- `name`
- `slug`
- `status`
- `category`
- `description`
- `thumbnailUrl`
- `galleryUrls`
- `tags`
- `imprintMethods`
- `isCustomizable`
- `requiresArtwork`
- `requiresVerbiage`
- `stockMode`
- `stockQuantity`
- `createdAt`
- `updatedAt`

### `productVariants`

Potential fields:
- `productId`
- `size`
- `sku`
- `price`
- `stockQuantity`
- `active`

### `customerRequests`

Potential fields:
- `productId`
- `variantId`
- `customerName`
- `customerEmail`
- `customerPhone`
- `verbiage`
- `artworkFiles`
- `notes`
- `status`
- `createdAt`

### `adminUsers`

Potential fields:
- `email`
- `role`
- `createdAt`

Add or change these based on what you learn.

## First Admin Page MVP

Define the smallest useful admin screen.

Recommended first version:
- View products
- Add/edit product name, category, description, status, image URL, tags
- Add/edit variant size and price
- Mark product active/inactive
- Track whether product needs customer verbiage or artwork
- Save changes to Firebase

Do not add payments, checkout, billing, or public deployment changes without Andrew.

## Customer-Facing Ecommerce Ideas

Capture ideas, but do not build them yet.

Possible future features:
- Request quote / start order form
- Product-specific customization fields
- Artwork upload
- Verbiage entry
- Simple stock indicators
- Honors Plaques designer
- Cart or payment flow

## Open Questions

Add questions here as you review.

Starting questions:
- Which products are realistic to sell online first?
- Which products need custom text/verbiage?
- Which products need artwork upload?
- Do we need stock tracking for all products or only some?
- Who should have admin access?
- Should Firebase Hosting replace GitHub Pages later?
- What is the first product category for the plaques designer?

## Recommended First Build Step

After this plan is reviewed with Andrew, propose one small build step.

Do not start major code changes until the plan is reviewed.
