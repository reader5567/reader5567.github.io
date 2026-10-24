import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap()],
  site: "https://thadeussmith.com",
  // The About page became the Now page; keep old links working.
  redirects: {
    '/about': '/now',
  },
});
