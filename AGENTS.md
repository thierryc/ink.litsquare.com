# AGENTS.md

## Project shape
- This repo is a static marketing site for LitSquare Ink MD.
- Primary files:
  - `index.html`: page structure and content.
  - `styles.css`: all visual styling and responsive layout.
  - `main.js`: typed intro behavior and animation toggle.
  - `src/`: icons and background image assets.
  - `website/Welcome.md`: source copy and feature language reference.
- There is no bundler or framework. Edit the shipped files directly.

## Working rules
- Keep the first-screen intro intact unless the task explicitly changes it.
- Preserve the current visual language: white macOS-style window over the image background, monospace/editor feel, restrained motion.
- Prefer semantic HTML and simple CSS over adding tooling or dependencies.
- Keep JavaScript minimal. Most content/layout work should stay in HTML/CSS.
- If changing copy, align it with `website/Welcome.md` and the current product positioning.

## Local preview
- Serve the repo root as a static site.
- Example: `python3 -m http.server 8000`
- Then open `http://127.0.0.1:8000/`

## Publish workflow
- Build the publish directory the same way the GitHub Pages workflow does:
  - create `_site/`
  - copy `index.html`, `styles.css`, `main.js`, `CNAME`
  - copy `src/` into `_site/src`
- GitHub Pages is the active host. Keep `.github/workflows/pages.yml` in sync with any change to published files.
- The live site updates when changes land on `main` and the Pages workflow runs successfully.
- If a future change introduces more generated files, update both the GitHub Pages workflow and this document.

## Validation
- Check desktop and mobile layouts.
- Confirm the typed intro still runs and the pause/play button still works.
- Confirm App Store links, canonical metadata, and asset paths remain valid after changes.
