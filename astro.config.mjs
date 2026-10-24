import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap()],
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
  // The About page became the Now page; keep old links working.
  redirects: {
    '/about': '/now',
  },
});
