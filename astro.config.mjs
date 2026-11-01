import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site as siteSettings } from './src/site.ts';

// Pages marked `noindex: true` in src/site.ts stay out of the XML sitemap,
// as does the 404 page.
const unlisted = new Set([
  '/404',
  ...Object.entries(siteSettings.pages)
    .filter(([, page]) => page.noindex)
    .map(([path]) => path),
]);
const listed = (url) => !unlisted.has(new URL(url).pathname.replace(/\/$/, '') || '/');

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap({ filter: listed })],
  site: "https://thadeussmith.com",
  // Astro 7 defaults to 'jsx' whitespace compression, which drops the
  // spaces between inline elements written on separate lines (the nav
  // would render as "Résumé,Writing,Now"). `true` keeps the earlier
  // behaviour: whitespace is collapsed, never removed.
  compressHTML: true,
  vite: {
    build: {
      // Keep the CSS readable by older browsers: without this the minifier
      // rewrites `(max-width: 800px)` as `(width <= 800px)` and drops the
      // `100vh` fallback, which would lose the phone layout on pre-2023 Safari.
      cssTarget: ['safari13', 'chrome80', 'firefox78'],
    },
  },
  // The About page became the Now page; keep old links working. /slashes is
  // the usual address for a list of a site's slash pages; ours is /sitemap.
  redirects: {
    '/about': '/now',
    '/slashes': '/sitemap',
  },
});
