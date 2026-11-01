// Site-wide settings that are easier to edit here than inside a template.

export type PageInfo = {
  label: string;
  group: string;
  description: string;
  noindex?: boolean;
  text?: boolean;
  showSite?: boolean;
};

export const site = {
  // Profiles listed in the footer's "Elsewhere" row, in this order. Each link
  // carries rel="me", which tells IndieWeb tools the profile is yours.
  elsewhere: [
    { label: 'Email', url: 'mailto:nrhw9q4y@anonaddy.me' },
    { label: 'Letterboxd', url: 'https://letterboxd.com/ThadeusOfNaz/' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/thadeushsmith/' },
    { label: 'Instagram', url: 'https://www.instagram.com/thadeusofnazereth/' },
    { label: 'X', url: 'https://x.com/ThadeusOfNaz/' },
    { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/User:ThadeusOfNazereth' },
  ],

  // Every page, by path. The human-readable /sitemap (added in a later
  // change) lists each page that exists under its `group`, with its
  // `label` and `description`; a path listed here that has no page yet is
  // skipped, and a page missing from here is still listed, by path.
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
    '/': { label: 'CV', group: 'Main', description: 'Work, education and volunteering.' },
    '/writing': { label: 'Words', group: 'Main', description: 'Essays, plus what I am watching, photographing and writing on Wikipedia.' },
    '/links': { label: 'Links', group: 'Main', description: 'Websites and online things I recommend.' },
    '/now': { label: 'Now', group: 'Main', description: 'Who I am and what I am doing lately.' },
    '/ai': { label: 'AI', group: 'About me and this site', description: 'How I use, and do not use, generative AI.', text: true },
    '/canon': { label: 'Canon', group: 'About me and this site', description: 'The works that have shaped me.' },
    '/sitemap': { label: 'Sitemap', group: 'About me and this site', description: 'Every page on this site.' },
    '/verify': { label: 'Verify', group: 'About me and this site', description: 'The accounts that are really mine.' },
    '/webrings': { label: 'Webrings', group: 'About me and this site', description: 'Webrings this site belongs to.' },
    '/blank': { label: 'Blank', group: 'Odds and ends', description: 'A deliberately empty page.', noindex: true },
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
