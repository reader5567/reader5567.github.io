# Notes

See `PLAN.md` for what has been decided about the site and what is still to come.

## Structure

- `src/layout.astro` is the shared page shell (head, header, footer). Every page uses it.
- `src/header.astro` is the name and the nav. `src/footer.astro` is the footer, including the design credit.
- `src/global.css` holds all site-wide styles, including the print stylesheet.
- `src/pages/` holds one file per page: `index.astro` (résumé), `writing.astro`, `now.astro`, plus `feed.xml.js` for RSS.

## Resume

The resume HTML is comprised of a single paragraph representing a position. Each position is made up of a Title, Company, Dates, and an optional description.

↓↓↓↓↓↓↓↓↓↓

```
<p class="resume">
<span class="position">POSTITION TITLE</span><br>
<span class="company">COMPANY</span>
<span class="date">DATES</span>
<span class="description">DESCRIPTION (Optional)</span>
</p>
```

Dates use an en dash (–), as in `June 2023–June 2026`.

## Now page

`src/pages/now.astro` is the "now" page (who I am, what I'm doing lately). Edit the paragraphs under "What I'm doing now" whenever things change; the Updated date in the footer is filled in automatically when the site builds. `/about` redirects here.

## Writing

All posts begin with the following YAML Header to define metadata. `layout: ../../post-layout.astro` defines the page styling and should be included for all posts. 

```
---
title: TITLE
date: POST DATE
layout: ../../post-layout.astro
---
```

### RSS Feed

You can change the information in the RSS feed by editing the javascript in `/src/pages/feed.xml.js`. The feed is served at `/feed.xml`.

## Credits

Design by [E. Beaton](https://cheap.urls.loan/).
