# Dragon Bones & Wizards Hats — Complete Style Guide

This document defines how we build, theme, and maintain **dragonbonesandwizardshats.com**. It is the single source of truth for structure, assets, filenames, story and legal workflows, forms, functions, and deployment.

---

## SITE IDENTITY

**Name:** Dragon Bones & Wizards Hats  
**Purpose:** Archive of original fantasy stories, plus Contact and Work With Me pages for sponsorships and collaborations.  
**Logo:** `/assets/Logodbwh.png`  
**Banner:** `/assets/Bannerdbwh.png`  
**Current Domains:**  
- Primary: `dragonbonesandwizardshats.com`  
- Preview: `*.pages.dev`

**External Links:**  
- YouTube (video adaptations)  
- Spotify (podcast/audio versions)

---

## REPOSITORY STRUCTURE

```
/
├─ index.html
├─ stories/
│  ├─ index.html
│  └─ the-thief-who-destroyed-time.html
├─ contact.html
├─ work-with-me.html
├─ privacy-policy.html
├─ terms-of-use.html
├─ assets/
│  ├─ Logodbwh.png
│  ├─ Bannerdbwh.png
│  ├─ Author.png
│  ├─ Dragon Wizard Battle.png
│  ├─ The Thief Who Destroyed Time (And Had to Fix It).png
│  ├─ The Thief Who Destroyed Time (And Had to Fix It).txt
│  ├─ css/
│  │  └─ site.css
│  ├─ js/
│  │  └─ site.js
│  └─ legal/
│     ├─ privacy-policy.txt
│     └─ terms-of-use.txt
├─ functions/
│  ├─ contact-submit.js
│  └─ sponsor-submit.js
└─ STYLEGUIDE.md
```

---

## DESIGN SYSTEM

**Philosophy:**  
Cinematic, legible, mobile-first. Teal glow accents against dark stone backgrounds.

**Colors:**  
- Teal accent — `#00BFA5`  
- Background — `#0B0F12`  
- Surface — `#0F1419`  
- Text primary — `#D9E1E8`  
- Text muted — `#92A1AD`

**Typography:**  
- UI: `system-ui, Inter, Roboto, Arial, sans-serif`  
- Story text: `Georgia, Times, serif`  
- Base font: 16px; line-height: 1.7  

**Layout:**  
- Max width: 980px  
- Rounded corners: 12px  
- Fluid single-column layout on mobile  
- 2-column grid ≥720px  

**Imagery:**  
- Banner = background layer, not a separate block  
- Responsive rule: `max-width:100%; height:auto;`  
- Object-fit: cover for hero and showcase images  

---

## GLOBAL COMPONENTS

**Header:**  
- Logo + title link to `/`  
- Nav items: Home, Stories, Contact, Work With Me  

**Footer:**  
```
© <span id="year"></span> dragonbonesandwizardshats •
<a href="/terms-of-use.html">Terms</a> •
<a href="/privacy-policy.html">Privacy</a> •
<a href="/contact.html">Contact</a>
```

---

## STORY WORKFLOW — TXT AS SOURCE OF TRUTH

**Rule:**  
Every story lives as a `.txt` file in `/assets/` or `/assets/stories/`.  
Never paste the prose directly into HTML.

### FILES PER STORY
- TXT: `/assets/<Exact Title>.txt`  
  Example: `/assets/The Thief Who Destroyed Time (And Had to Fix It).txt`
- Cover image: `/assets/<Exact Title>.png`
- Story page: `/stories/<slug>.html`

### STORY PAGE TEMPLATE
Each story HTML file loads its TXT and cover dynamically.

```
<article id="story"
  data-text="/assets/The Thief Who Destroyed Time (And Had to Fix It).txt"
  data-image="/assets/The Thief Who Destroyed Time (And Had to Fix It).png">
  <nav class="story-links">
    <a href="https://youtu.be/-i-ZGzN2j-E" target="_blank">Watch on YouTube</a>
    <a href="https://open.spotify.com/show/3piG2nuJ2M2xjwbQ7Eu8Df" target="_blank">Listen on Spotify</a>
  </nav>
  <img id="storyImage" alt="Story cover">
  <pre id="storyText">Loading…</pre>
</article>

<script>
const a=document.getElementById('story');
const txt=encodeURI(a.dataset.text);
const img=encodeURI(a.dataset.image);
document.getElementById('storyImage').src=img;
fetch(txt,{cache:'no-store'})
.then(r=>r.ok?r.text():Promise.reject(r.status))
.then(t=>{document.getElementById('storyText').textContent=t})
.catch(()=>{document.getElementById('storyText').textContent='Failed to load story.'});
</script>
```

**Media links:** Always appear before the story text.

---

## STORIES INDEX PAGE

Grid of story cards linking to individual pages.

```
<a class="story-card" href="/stories/the-thief-who-destroyed-time.html">
  <img src="/assets/The Thief Who Destroyed Time (And Had to Fix It).png" alt="Story cover">
  <h3>The Thief Who Destroyed Time (And Had to Fix It)</h3>
</a>
```

Newest story always appears first.

---

## HOMEPAGE — LATEST STORY FEATURE

The homepage highlights the latest story with:
- Cover image  
- Title + one-sentence teaser  
- “Read now” button  
- Optional “Watch on YouTube” and “Listen on Spotify” links  

Banner image acts as subtle background.  
Showcase image (`Dragon Wizard Battle.png`) may appear in a mid-page highlight section.

---

## LEGAL PAGES — IMMUTABLE TEXT

All legal copy is stored as raw `.txt` under `/assets/legal/`.

```
/assets/legal/privacy-policy.txt
/assets/legal/terms-of-use.txt
```

Each HTML page (`/privacy-policy.html`, `/terms-of-use.html`) loads its TXT verbatim using:

```
fetch('/assets/legal/terms-of-use.txt', {cache:'no-store'})
  .then(r => r.text())
  .then(t => {document.getElementById('legal').textContent=t});
```

Displayed inside `<pre id="legal"></pre>` to preserve exact formatting.

**No auto-edits or scripts modify legal text.**

---

## FORMS & FUNCTIONS

**Forms:**
- `/contact.html` → `/functions/contact-submit`
- `/work-with-me.html` → `/functions/sponsor-submit`

Use Cloudflare Turnstile widget:
```
<div class="cf-turnstile" data-sitekey="0x4AAAAAAB0vOSqh9kDdb7s_"></div>
```

**Functions:**
- Cloudflare Pages Functions format  
- Use `onRequestPost`  
- Send email via Resend API  
- Env variable: `RESEND_API_KEY` (Secret)  
- “From”: `Dragon Bones & Wizards Hats <contact@dragonbonesandwizardshats.com>`  
- Optional Turnstile validation with `TURNSTILE_SECRET`

**Success Behavior:** redirect with `?sent=1`, display a teal toast message.

---

## CSS GUIDELINES

**site.css must contain:**
- Responsive image and layout rules  
- `.btn` teal accent glow  
- `.story-card` hover glow  
- Toast style:
```
#toast {
  background: rgba(0,191,165,0.2);
  border: 1px solid #00bfa5;
  color: #00ffcc;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  font-weight: 500;
  box-shadow: 0 0 10px rgba(0,191,165,0.3);
  animation: fadeIn .6s ease-out;
}
@keyframes fadeIn {
  from {opacity:0; transform:translateY(10px);}
  to {opacity:1; transform:none;}
}
```

---

## ACCESSIBILITY & SEO

- Every `<img>` requires descriptive `alt` text  
- Single `<h1>` per page  
- Color contrast meets WCAG AA  
- Keyboard focus visible  
- `<meta name="description">` per page  

---

## DEPLOYMENT

**Cloudflare Pages**  
- Project: `dragonbonesandwizardshats-site`  
- Build command: none (static HTML)  
- Output directory: `/`  
- Functions auto-detected from `/functions/`  

**Custom Domain:**  
- Add `dragonbonesandwizardshats.com` under *Pages → Custom Domains*  
- Keep `.pages.dev` as staging  
- DNS managed automatically after linking  

---

## NEW STORY CHECKLIST

1. Add TXT → `/assets/<Title>.txt`  
2. Add Cover → `/assets/<Title>.png`  
3. Create `/stories/<slug>.html` using template  
4. Add to `/stories/index.html`  
5. Update homepage “Latest Story” section  
6. Verify all links and images  
7. Confirm story text loads correctly  
8. Check YouTube/Spotify links  
9. Redeploy and test  

---

## MAINTENANCE RULES

- Never paste story prose into HTML  
- Never alter legal text inside HTML  
- Filenames must remain exact  
- Commit full files only  
- Use clear commit messages:  
  `feat(story): add <title>`  
  `fix(form): update resend endpoint`  
  `style(css): tweak teal glow`

---

## SUMMARY

Dragon Bones & Wizards Hats runs as a clean static site on Cloudflare Pages, with all content (stories, legal text) loaded dynamically from immutable TXT assets.  
Every visual and behavioral rule lives here to ensure total consistency between future updates.

*This file is authoritative. No edits to structure, color, or workflow should occur without updating this guide.*
