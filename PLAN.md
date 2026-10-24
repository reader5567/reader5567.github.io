# Site plan

Agreed October 24, 2026. This file records what was decided so that any
future work (by Thadeus, by E. Beaton, or by an AI assistant in a fresh
session) starts from the same page. Edit it as decisions change.

## Ground rules

- **The appearance does not change.** Mona Sans, the dotted background,
  the black frame, uppercase headings, bordered sections. New content uses
  the existing styles; no new colors, fonts or layout primitives.
- **Quiet web.** No ads, no trackers, no analytics, no third-party fonts,
  and no JavaScript in the visitor's browser. Anything that needs outside
  data is fetched at build time and baked into plain HTML.
- **Credit.** The design is by E. Beaton (https://cheap.urls.loan/). The
  credit lives in the shared footer on every page.

## Pull request 1: content and repairs (this PR)

- Résumé updated from LinkedIn (October 2026). Curated, not exhaustive:
  short early roles are deliberately omitted.
- About page folded into a `/now` page (`/about` redirects there).
  Nav is now "Résumé, Writing, Now".
- Shared layout (`src/layout.astro`) and footer (`src/footer.astro`) so
  the RSS link, metadata and credit are defined once.
- Fixed RSS autodiscovery (pointed at `rss.xml`; the feed is `feed.xml`).
- Writing list wrapped in a real `<ul>`.
- Umami analytics script removed.
- Print stylesheet for the résumé; skip link; meta descriptions;
  `rel="me"` links to GitHub and Wikipedia (groundwork for the IndieWeb
  webring sign-in).

## Pull request 2: Astro upgrade (done)

- Moved from Astro 4.16 to Astro 7.4 (through 5 and 6 in one step).
  Verified by building both versions and comparing every page: the
  Writing, Now and essay pages are pixel-identical at desktop and phone
  widths; the sitemap is byte-identical; the RSS feed differs by one
  trailing space.
- `Astro.glob` (removed in Astro 6) replaced with `import.meta.glob` in
  the writing index. The RSS feed awaits `compiledContent()`, which has
  returned a Promise since Astro 5.
- Node 24 in `.github/workflows/astro.yml` and `.nvmrc`. Astro 7 needs
  22.23.4 or newer; the first attempt pinned "22", but the GitHub runner's
  cached Node 22 was 22.23.3 and the build refused to start, so the
  workflow uses the 24 LTS line instead.
- Two settings in `astro.config.mjs` keep the output matching the old
  build. `compressHTML: true` because the Astro 7 default (`'jsx'`)
  removes the spaces between the nav links. A conservative Vite
  `cssTarget` because the new minifier otherwise drops the `100vh`
  fallback and rewrites `(max-width: 800px)` as `(width <= 800px)`,
  which pre-2023 Safari would not understand.
- Astro 7 also swaps the Markdown processor (remark → Sätteri). The only
  effect on the essay was one `--` rendering as an en dash instead of an
  em dash; the source now has a literal em dash so it no longer depends
  on the processor.
- One rendering change, deliberate: the Experience `<div>` on the résumé
  was left unclosed in an edit after PR 1, so Education and Volunteering
  were nested inside it and drew a doubled left border. The new compiler
  refuses unclosed tags, so the div is closed and each section has a
  single border again, as in PR 1.

## Pull request 3: Elsewhere, Links, webrings, nightly rebuild (done)

- Build-time fetchers (no browser JavaScript) for:
  - Letterboxd: `https://letterboxd.com/thadeusofnaz/rss/`. Show title,
    year, star rating as text, watched date, review excerpt, link. No
    posters.
  - Wikimedia Commons uploads by ThadeusOfNazereth. "Photo of the day":
    one original (uncropped) upload, chosen at build time, in the
    existing bordered image style, captioned and linked.
  - Wikipedia: the "My contributions" section of
    `User:ThadeusOfNazereth` is the single source of truth; the site
    renders it with the same groupings (Biographies, Books, Elections,
    Other). Nothing else from the user page is pulled in.
- Writing page becomes two parts: posts, then an "Elsewhere" heading
  with the three sections above. A "skip to Elsewhere" link at the top.
- "Currently" line in the footer: last film, last edit, last upload.
- `/links` page, seeded from the reading lists on the Wikipedia user
  page, in the existing bordered-list style.
- Webrings: IndieWeb webring (https://xn--sr8hvo.ws/) links in the
  footer; Wayward Webring (https://waywardweb.org/) on `/links` once
  approved. Both are plain links, no scripts.
- Nightly `schedule:` trigger in the Pages workflow so the fetched data
  stays fresh. If a fetch fails, the build fails and GitHub Pages keeps
  serving the last good version.

Notes from the build:

- Fetchers live in `src/lib/`; each URL is fetched once per build and a
  failed fetch throws. `FETCH_CACHE_DIR` enables an offline cache for
  local work.
- The Commons photo is served from this site (`/photo-of-the-day.jpg`,
  1280px wide) rather than hotlinked, so visitors make no request to
  Wikimedia. "Original" means any upload without "crop" in its name and
  at least 1000px wide; the pick is `day number mod count` over the
  uploads oldest-first, so it changes daily and stays stable as new
  uploads arrive.
- The Wikipedia section renders the user page's own headings
  (Biographies, Books, Elections, Other articles). GA/FA/FL/A and DYK
  from the `{{icon}}` templates appear as small text tags; start/C/stub
  classes are not shown. Parenthetical notes ("Translated from Spanish")
  are kept as link tooltips.
- The Letterboxd excerpts drop the "On list: …" boilerplate the feed
  appends to reviews written from a list.
- `/links` is a static copy of the reading lists (not synced), reachable
  from a "Links" row in the footer; the nav stays "Résumé, Writing, Now".
- Webring URLs are pasted into `src/site.ts`; nothing renders until they
  are filled in. The IndieWeb links go in the footer, which is on the
  homepage as the ring's checker requires.
- Schedule: 06:23 UTC daily.

## Deliberately not planned

- 88×31 buttons (maybe later), guestbook (needs a backend), dark mode
  (an appearance change), Tiny Awards (site predates their window).
- The RSS feed stays essays-only.
