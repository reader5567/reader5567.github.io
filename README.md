# Notes

## Ground rules

Agreed October 2026, when the site was refreshed in three pull requests.

- **The appearance does not change.** Mona Sans, the dotted background,
  the black frame, uppercase headings, bordered sections. New content uses
  the existing styles; no new colors, fonts or layout primitives.
- **Quiet web.** No ads, no trackers, no analytics, no third-party fonts,
  and no JavaScript in the visitor's browser. Anything that needs outside
  data is fetched at build time and baked into plain HTML.
- **Credit.** The design is by E. Beaton (https://cheap.urls.loan/). The
  credit lives in the shared footer on every page.

Deliberately not done: 88×31 buttons (maybe later), a guestbook (needs a
backend), dark mode (an appearance change), Tiny Awards (the site predates
their window). The RSS feed stays essays-only.

## Structure

- `src/layout.astro` is the shared page shell (head, header, footer). Every page uses it.
- `src/header.astro` is the name and the nav. Hovering or focusing "Writing" opens a CSS-only menu (Writing, Elsewhere, Links); the styles are in `global.css` under `nav .menu`. `src/footer.astro` is the footer, including the design credit.
- `src/global.css` holds all site-wide styles, including the print stylesheet.
- `src/pages/` holds one file per page: `index.astro` (résumé), `writing.astro`, `now.astro`, `links.astro`, plus `feed.xml.js` for RSS and `photo-of-the-day.jpg.ts` for the Commons photo.
- `src/lib/` holds the build-time fetchers (`letterboxd.ts`, `commons.ts`, `wikipedia.ts`) and the shared `fetch.ts` helper. Nothing in here runs in the visitor's browser.
- `src/site.ts` holds settings you may want to edit by hand: webring URLs and how many films the Writing page shows.

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

## h-card

The top of the résumé (`src/pages/index.astro`) is a [representative h-card](https://microformats.org/wiki/representative-h-card-authoring): `p-name`, `u-photo`, `p-note`, and a `u-url`/`u-uid` equal to the homepage URL. IndieWeb tools, including the webring directory, read the name, photo and note from it. The photo is `public/thadeus.jpg`, by Hari Adivarekar (CC BY 4.0) from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:069WCNA25_HariA_DSCF3207_(cropped).jpg); keep the credit line if you swap it.

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

### Elsewhere

Below the posts, the Writing page shows three sections filled in when the site builds:

- **Letterboxd**: the latest diary entries from `https://letterboxd.com/thadeusofnaz/rss/`. Title, year, stars, date, and the start of the review. No posters.
- **Photo of the day**: one of your original (uncropped) Commons uploads, chosen by the calendar date, served from this site at `/photo-of-the-day.jpg`. Files with "crop" in the name are skipped.
- **Wikipedia**: the "My contributions" section of your user page, with its headings. Edit the user page and the site follows on the next build.

The footer's "Currently" line (last film, last article edited, last upload) comes from the same fetchers.

A GitHub Actions schedule rebuilds the site nightly so this stays fresh. If any fetch fails the build fails and GitHub Pages keeps serving the previous version; check the Actions tab if the Updated date in the footer stops moving.

To build offline, set `FETCH_CACHE_DIR=.fetch-cache` (gitignored): responses are cached there after the first successful fetch.

## Links page

`src/pages/links.astro` is a hand-maintained page. It was seeded from the Recommended Reading lists on the Wikipedia user page in October 2026 but is not synced; edit it directly. The Wayward Webring block appears once `src/site.ts` marks the application approved.

## Webrings

`src/site.ts` holds the IndieWeb webring URLs (shown in the footer on every page, which satisfies the ring's homepage check) and the Wayward Webring URLs (shown on `/links`). Both are plain links; no scripts.

### RSS Feed

You can change the information in the RSS feed by editing the javascript in `/src/pages/feed.xml.js`. The feed is served at `/feed.xml`.

## Credits

Design by [E. Beaton](https://cheap.urls.loan/).
