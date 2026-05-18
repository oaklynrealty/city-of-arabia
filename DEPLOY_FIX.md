# City of Arabia Image Deploy Fix

The live page can load `styles.css`, but the image URL returns `404`:

`/assets/city-of-arabia/01-hero-aerial-render.jpg`

This means Vercel deployed the page without the image assets folder.

## Required Folder Structure

Before importing or uploading to Vercel, the project folder must include:

```text
package.json
vercel.json
scripts/
src/
assets/
  city-of-arabia/
    01-hero-aerial-render.jpg
    15-gallery-lap-pool-athletic.jpg
    16-gallery-beach-lagoon-clubhouse.jpg
    ...
```

## If Deploying From GitHub

Commit the full `assets/city-of-arabia/` folder to the repository, then redeploy on Vercel.

## If Deploying By Upload

Upload the full project folder or the refreshed zip from the Desktop. Do not upload only `src`, `scripts`, or `dist`.

## Verify After Redeploy

Open:

`https://city-of-arabia.vercel.app/assets/city-of-arabia/01-hero-aerial-render.jpg`

If the image loads, the landing page visuals will load.
