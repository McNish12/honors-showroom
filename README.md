# Honors Showroom Static Catalog

This repository provides a static version of the Honors showroom catalog that can be hosted on any plain web server. All interactions run entirely in the browser, so you can deploy the site by uploading the compiled assets to your hosting provider.

## Structure
```
index.html                # Static catalog entry point
preview.html              # Standalone preview of the showroom experience
preview-showroom.html     # Alternate preview layout used for design reviews
404.html                  # Static not-found page for static hosts
Assets/                   # Product imagery and downloadable files
scripts/                  # JavaScript used by the catalog pages
styles/                   # Shared styling for the static pages
```

> **Note:** Previous versions of this project shipped a `theme/` directory with Liquid templates for BrightSites/Shopify style storefronts. The Liquid theme has been removed because the catalog now targets static hosting only.

## Local development
Open `index.html` directly in your browser or run a lightweight static server (for example `npx serve .`) to preview the catalog locally. No build step is required.

## Deployment
Upload the contents of the repository (excluding development metadata such as this README) to your hosting provider. Any static host—such as GitHub Pages, Netlify, or an S3 bucket—can serve the catalog without additional configuration.
