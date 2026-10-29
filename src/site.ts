// Site-wide settings that are easier to edit here than inside a template.

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
