// Site-wide settings that are easier to edit here than inside a template.

export type PageInfo = {
  label: string;
  group: string;
  description: string;
  noindex?: boolean;
  text?: boolean;
  showSite?: boolean;
  extra?: boolean;
};

export const site = {
  // The footer's profile links live in src/content/accounts/, one file per
  // account, so they can be edited in Obsidian.

  // Every page, by path. The human-readable /sitemap lists each page that
  // exists under its `group`, with its `label` and `description`; a path
  // listed here that has no page yet is skipped, and a page missing from
  // here is still listed, by path.
  //
  // `extra: true` also puts the page in the footer's Extras row (in
  // alphabetical order, and only once the page exists).
  //
  // `noindex: true` asks search engines not to index the page and leaves
  // it out of the XML sitemap (astro.config.mjs reads this list).
  //
  // `text: true` marks a page written entirely in Obsidian as
  // src/content/<name>.md. It is published only while that file sits
  // directly in src/content/: keep a draft in src/content/_drafts/ and
  // move it up when it is ready. `showSite: false` hides the footer's
  // Currently, Elsewhere and Updated lines on it.
  pages: {
    '/': { label: 'CV', group: 'Main', description: 'My resume.' },
    '/writing': { label: 'Words', group: 'Main', description: 'Self-explanatory, I think.' },
    '/links': { label: 'Links', group: 'Main', description: 'My favorite things online' },
    '/now': { label: 'Now', group: 'Main', description: 'What I am up to.' },
    '/ai': { label: 'AI', group: 'About me and this site', description: 'How I use (and do not use) AI.', text: true, extra: true },
    '/canon': { label: 'Canon', group: 'About me and this site', description: 'My personal canon.', extra: true },
    '/sitemap': { label: 'Sitemap', group: 'About me and this site', description: 'The page you are looking at now.', extra: true },
    '/verify': { label: 'Verify', group: 'About me and this site', description: 'My online identity.', extra: true },
    '/webrings': { label: 'Webrings', group: 'About me and this site', description: 'Webrings this site belongs to.' },
    '/blank': { label: 'Blank', group: 'Odds and ends', description: 'This page was deliberately left empty.', noindex: true },
    '/death': { label: 'Death', group: 'Odds and ends', description: 'Instructions for family and friends if I die.', noindex: true, text: true, showSite: false },
  } as Record<string, PageInfo>,

  // How many recent Letterboxd entries the Writing page shows.
  recentFilms: 8,

  // Who you are, in one place. The Now page shows the photo and note; the
  // homepage carries the same details as an invisible h-card, which is what
  // the IndieWeb webring directory reads (it only looks at the homepage).
  // Edit the note here and both pages change together.
  profile: {
    name: 'Thadeus Smith',
    note: 'I am an educator, writer, and Wikipedia administrator from the Pacific Northwest, now living in Boston. I love books, movies, Wikipedia, and speech & debate.',
    photo: '/thadeus.jpg',
    photoWidth: 480,
    photoHeight: 720,
    photoCredit: 'Hari Adivarekar',
    photoLicense: 'CC BY 4.0',
    photoSource: 'https://commons.wikimedia.org/wiki/File:069WCNA25_HariA_DSCF3207_(cropped).jpg',
  },
};
