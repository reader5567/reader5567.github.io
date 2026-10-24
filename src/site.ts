// Site-wide settings that are easier to edit here than inside a template.

export const site = {
  // IndieWeb webring (https://xn--sr8hvo.ws/). After signing in there with
  // https://thadeussmith.com, the Dashboard's "Your Webring Links" section
  // gives two URLs. Paste them here and the footer shows them on every
  // page, including the homepage where the webring's checker looks.
  // Leave both empty and nothing is rendered.
  indieWebRing: {
    previous: 'https://xn--sr8hvo.ws/previous',
    next: 'https://xn--sr8hvo.ws/next',
    approved: true,
  },

  // Wayward Webring (https://waywardweb.org/). Once the application is
  // approved, paste the URLs the ring gives you and set `approved` to true;
  // the links then appear on /links.
  waywardWebring: {
    approved: false,
    previous: '',
    next: '',
    home: 'https://waywardweb.org/',
  },

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
