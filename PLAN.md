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

## Pull request 2: Astro upgrade

- Move from Astro 4 (legacy, last patched August 2025) to the current
  major release. Success criterion: every page renders identically.
- `Astro.glob` (deprecated) replaced in the writing index and RSS feed.
- Node version in `.github/workflows/astro.yml` bumped as required.
- If the upgrade proves troublesome, close the PR and build PR 3 on
  Astro 4 instead.

## Pull request 3: Elsewhere, Links, webrings, nightly rebuild

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

## Deliberately not planned

- 88×31 buttons (maybe later), guestbook (needs a backend), dark mode
  (an appearance change), Tiny Awards (site predates their window).
- The RSS feed stays essays-only.
