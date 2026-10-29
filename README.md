# Notes

## Ground rules

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
their window).

## Structure

- `src/layout.astro` is the shared page shell (head, header, footer). Every page uses it.
- `src/header.astro` is the name and the nav: CV, Words, Links, Now. `src/footer.astro` is the footer, including the design credit and the "Elsewhere" row of profile links (edit those in `src/site.ts`).
- `src/global.css` holds all site-wide styles, including the print stylesheet.
- `src/pages/` holds one file per page: `index.astro` (résumé), `writing.astro`, `now.astro`, `links.astro`, `webrings.astro`, plus `photo-of-the-day.jpg.ts` for the Commons photo. These are the templates: layout and styles.
- `src/content/` holds the words for the Résumé, Now, Links and Webrings pages as Markdown (see below). `src/content.config.ts` describes those files, and `src/lib/markdown.ts` turns them into the markup the templates have always used, so the design does not change.
- `src/pages/writing/` holds the essays, one Markdown file each.
- `src/lib/` holds the build-time fetchers (`letterboxd.ts`, `commons.ts`, `wikipedia.ts`) and the shared `fetch.ts` helper. Nothing in here runs in the visitor's browser.
- `src/site.ts` holds settings you may want to edit by hand: the footer's profile links, how many films the Writing page shows, and your profile (name, note, photo).

## Editing in Obsidian

Everything you write lives in Markdown, so the whole repository can be opened as an Obsidian vault (`.obsidian/` is gitignored, so the vault settings stay on your computer). The Git plugin's "Commit-and-sync" command publishes: GitHub rebuilds the site a few minutes after each push.

| Page | Edit |
| --- | --- |
| Résumé | `src/content/resume/` |
| Now | `src/content/now.md` |
| Links | `src/content/links.md` |
| Webrings | `src/content/webrings/` |
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

Below the posts, the Writing page ("Words" in the nav) shows three sections filled in when the site builds. A line of links at the top of the page jumps to each: Posts · Letterboxd · Photo · Wikipedia.

- **Letterboxd**: the latest diary entries from `https://letterboxd.com/thadeusofnaz/rss/`. Title, year, stars, date, and the start of the review. No posters.
- **Photo of the day**: one of your original (uncropped) Commons uploads, chosen by the calendar date, served from this site at `/photo-of-the-day.jpg`. Files with "crop" in the name are skipped.
- **Wikipedia**: the "My contributions" section of your user page, with its headings. Edit the user page and the site follows on the next build.

The footer's "Currently" line (last film, last article edited, last upload) comes from the same fetchers.

A GitHub Actions schedule rebuilds the site nightly so this stays fresh. If any fetch fails the build fails and GitHub Pages keeps serving the previous version; check the Actions tab if the Updated date in the footer stops moving.

To build offline, set `FETCH_CACHE_DIR=.fetch-cache` (gitignored): responses are cached there after the first successful fetch.

## Links page

The list is `src/content/links.md`, hand-maintained, and limited to things a visitor can open online. Each `##` heading is a section and each `###` heading a subsection (`####` also works, one level further down). The line of jump links at the top of the page is built from the `##` headings, so adding, renaming or reordering a section there updates it on the next build. Empty sections still show, heading only, until they have entries.

Each item is two lines: the title (with " by author" if there is one), then the description on the next line, indented to line up with the title:

```
## Reading

### Internet fiction

- [The SCP Foundation](https://scp-wiki.wikidot.com/)
  The single greatest work of collaborative fiction to have ever existed.
```

The title shows in bold and the description in the small grey type below it. `src/pages/links.astro` is the template.

The book recommendations that used to be on this page are kept, unpublished, in `src/content/_archive/links-books.md`. Nothing in `src/content/_archive/` appears on the site.

## Webrings

Each webring is one Markdown file in `src/content/webrings/`. `/webrings` lists every ring that is ready, and the footer's Webring row links to it with "more". Plain links only; no scripts.

```
---
name: Wayward Webring
home: https://waywardweb.org/
previous: https://…
next: https://…
approved: true
footer: false
footerLabel:
order: 20
---
A ring of personal sites worth wandering.
```

- `name` and `home` are the ring's name and its home page. The body is the one-line description shown under the name.
- `previous` and `next` are the neighbor URLs the ring gives you when you join (often on its dashboard or in its "webring code"). If a ring gives you a code snippet instead, copy the two `href` URLs out of it.
- `approved`: the ring appears only when this is ticked **and** `previous` and `next` are filled in. Add the file when you apply, tick it when you're accepted.
- `footer`: also show the ring as a row in the footer of every page. The IndieWeb ring needs this, because its checker looks for the links on the homepage and marks the site inactive if they're missing. Each footer ring is another row, so only tick it for rings that require it. `footerLabel` is the text of the middle link there (the IndieWeb ring uses 🕸💍); blank uses the name.
- `order`: position on `/webrings`, lowest first, in tens like the résumé.

Before joining a ring, check its rules for where the links have to go. A ring that only needs to be linked from somewhere on the site is satisfied by `/webrings`; one that checks the homepage needs `footer` ticked.

## Credits

Design by [E. Beaton](https://cheap.urls.loan/).
