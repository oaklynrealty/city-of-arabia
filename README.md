# City of Arabia Standalone Landing Project

This folder is a separate Vercel-ready project for:

- `city-of-arabia.oaklynrealty.ae`

It does not contain Tilal Binghatti project data.

## Routes

- Landing page: `/`
- Route alias: `/city-of-arabia`
- Thank-you page: `/thank-you`
- Alternate thank-you page: `/city-of-arabia-thank-you`

## Build

```bash
npm run build
```

Generated static files are written to `dist/`.

## Vercel Settings

- Build Command: `npm run build`
- Output Directory: `dist`
- Make sure the `assets/city-of-arabia/` folder is uploaded or committed with the project. The live page will show grey image panels if this folder is missing.

## Main Files

- `src/project-data.mjs` controls City of Arabia content, local images, route metadata, webhook identifiers, and compliance text.
- `assets/city-of-arabia/` contains the City of Arabia landing images.
- `src/styles.css` controls the shared Oaklyn landing page visual system.
- `src/client.js` controls tracking, hidden fields, webhook submission, `dataLayer`, and thank-you redirects.
- `scripts/build.mjs` generates the static pages.
- `scripts/check.mjs` validates generated HTML and tracking identifiers.

## Image Deployment Check

After deployment, open this URL in the browser:

`https://city-of-arabia.vercel.app/assets/city-of-arabia/01-hero-aerial-render.jpg`

If it returns `404`, the project was deployed without the `assets/city-of-arabia/` folder. Re-upload the full folder or commit the images to GitHub, then redeploy.
