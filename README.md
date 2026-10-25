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
- `src/pages/` holds one file per page: `index.astro` (résumé), `writing.astro`, `now.astro`, `links.astro`, plus `feed.xml.js` for RSS and `photo-of-the-day.jpg.ts` for the Commons photo. These are the templates: layout and styles.
- `src/content/` holds the words for the Résumé, Now and Links pages as Markdown (see below). `src/content.config.ts` describes those files, and `src/lib/markdown.ts` turns them into the markup the templates have always used, so the design does not change.
- `src/pages/writing/` holds the essays, one Markdown file each.
- `src/lib/` holds the build-time fetchers (`letterboxd.ts`, `commons.ts`, `wikipedia.ts`) and the shared `fetch.ts` helper. Nothing in here runs in the visitor's browser.
- `src/site.ts` holds settings you may want to edit by hand: webring URLs and how many films the Writing page shows.

## Editing in Obsidian

Everything you write lives in Markdown, so the whole repository can be opened as an Obsidian vault (`.obsidian/` is gitignored, so the vault settings stay on your computer). The Git plugin's "Commit-and-sync" command publishes: GitHub rebuilds the site a few minutes after each push.

| Page | Edit |
| --- | --- |
| Résumé | `src/content/resume/` |
| Now | `src/content/now.md` |
| Links | `src/content/links.md` |
| Writing | `src/pages/writing/` (drafts in `src/pages/writing/_drafts/`) |

The one sentence about you on the Now page (and in the homepage h-card) is `profile.note` in `src/site.ts`, which Obsidian does not show.

Markdown turns straight quotes into curly ones (it always has, in the essays), so `"` and `'` can be typed normally.

## Resume

Each position is one Markdown file in `src/content/resume/`, in the folder for its section: `experience/`, `education/` or `volunteering/`. The Properties at the top hold the position, company, dates and order; the body is the description, which is optional.

```
---
position: Director of Education
company: Lumos Debate
dates: June 2026–Present
order: 10
---
One optional paragraph introducing the organization.

- A bullet point
- Another bullet point
```

`order` sets where the entry sits in its section, lowest first. The existing entries go up in tens, so a new one can slot in between (15 goes between 10 and 20). Paragraphs show first and bullets show as "•" lines, as they always have. Links (`[text](url)`) and italics (`*text*`) work in the description.

Dates use an en dash (–), as in `June 2023–June 2026`.

## h-card

The homepage carries an invisible [representative h-card](https://microformats.org/wiki/representative-h-card-authoring): `p-name`, `u-photo`, `p-note`, and a `u-url`/`u-uid` equal to the homepage URL, all as `<data>` elements so nothing shows on the résumé. IndieWeb tools, including the webring directory, read the name, photo and note from it, and they only look at the homepage. The visible version (photo beside the opening paragraph) is on the Now page. Both read from `profile` in `src/site.ts`, so edit the note there. The photo is `public/thadeus.jpg`, by Hari Adivarekar (CC BY 4.0) from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:069WCNA25_HariA_DSCF3207_(cropped).jpg); keep the credit line if you swap it.

## Now page

The "What I'm doing now" text is `src/content/now.md`; edit it whenever things change, including the month in its heading. `src/pages/now.astro` is the template (the photo and opening paragraph). The Updated date in the footer is filled in automatically when the site builds. `/about` redirects here.

## Writing

Each `.md` file in `src/pages/writing/` is published as a post, and its filename becomes the URL (`new-post.md` is `/writing/new-post`; use hyphens, not spaces). Keep unfinished posts in `src/pages/writing/_drafts/`: Astro skips folders whose names start with an underscore, so nothing there is published or listed. The repository is public, though, so drafts there can be read on GitHub.

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

The list is `src/content/links.md`, hand-maintained. It was seeded from the Recommended Reading lists on the Wikipedia user page in October 2026 but is not synced. Each `###` heading is a section, and each item is two lines: the title (with " by author" if there is one), then the description on the next line, indented to line up with the title:

```
- [*Piranesi*](https://en.wikipedia.org/wiki/Piranesi_(novel)) by [Susanna Clarke](https://en.wikipedia.org/wiki/Susanna_Clarke)
  A quick, fun read about a 'lil guy wandering a mysterious house.
```

The title shows in bold and the description in the small grey type below it. `src/pages/links.astro` is the template. The Wayward Webring block appears once `src/site.ts` marks the application approved.

## Webrings

`src/site.ts` holds the IndieWeb webring URLs (shown in the footer on every page, which satisfies the ring's homepage check) and the Wayward Webring URLs (shown on `/links`). Both are plain links; no scripts.

### RSS Feed

You can change the information in the RSS feed by editing the javascript in `/src/pages/feed.xml.js`. The feed is served at `/feed.xml`.

## Credits

Design by [E. Beaton](https://cheap.urls.loan/).
