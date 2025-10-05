# Dragon Bones & Wizards Hats — Style Guide

## Purpose
Maintain a consistent look, tone, and structure for all story pages and site content.

---

## 🧱 Layout Structure
Each story page follows this order:
1. **Header:** Site title and nav (consistent across all pages)
2. **Hero section:** Story title, subtitle, and story thumbnail image
3. **Listen/Watch buttons:** YouTube + Spotify links
4. **Story body:** Clean typography with wide margins
5. **Footer:** Year + navigation links

---

## 🎨 Theme & Design
- **Primary color:** #009999 (teal accent)
- **Background:** Black with teal highlights and soft gradients
- **Font:** "Poppins" or system sans-serif
- **Link hover:** Light teal glow
- **Buttons:** Rounded, solid teal background, white text
- **Images:** Max width 100%, auto height, never overflow

---

## 🪶 Story Card Layout (Stories Index)
- Each story = one `<article>` block
- Thumbnail (left) + Title + Short summary
- Whole card clickable

```html
<article class="story-card">
  <a href="/stories/example-story.html">
    <img src="/assets/example-story.png" alt="Example story thumbnail" />
    <div class="story-info">
      <h2>Example Story Title</h2>
      <p>Short one-line summary here.</p>
    </div>
  </a>
</article>
