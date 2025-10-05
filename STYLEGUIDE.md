# Dragon Bones & Wizards Hats – Style Guide

This document defines the site’s structure, visual theme, and repeatable patterns for adding new pages or features.

---

## Theme

- Mobile-first responsive design  
- Background uses the banner image (`/assets/bannerdbwh.png`) as a subtle hero or background texture  
- Color palette: teal #00BFA5 accents, dark stone #111, parchment backgrounds for story text  
- Typography: legible serif for story content, sans-serif for UI elements  
- Buttons and links use teal hover glow

---

## Story Pages

- Each story lives at `/stories/<slug>.html`
- Each story pulls its text from `/assets/stories/<slug>.txt`
- Each story must include:
  - Title heading (`<h1>`)
  - Story art image (`/assets/images/<slug>.png`)
  - “Listen on Spotify” and “YouTube Video” links
  - Footer navigation consistent with the rest of the site
- When new stories are added:
  1. Upload the `.txt` and image to `/assets/stories/`
  2. Duplicate an existing story page
  3. Update title, image, and link references
  4. Add it to `/stories/index.html`

---

## Legal Pages

### Purpose
All legal documents (Terms of Use, Privacy Policy, etc.) are immutable text files loaded verbatim into their pages.

### Storage
`/assets/legal/terms-of-use.txt`  
`/assets/legal/privacy-policy.txt`

### Display Pages
`/terms-of-use.html`  
`/privacy-policy.html`

Each `.html` page:
- Uses the site header/footer for consistency  
- Loads its text via JavaScript:  
  ```js
  fetch('/assets/legal/privacy-policy.txt')
