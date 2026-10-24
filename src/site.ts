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
};
