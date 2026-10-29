// The words on the Résumé, Now, Links and Webrings pages live as Markdown in
// src/content/, so they can be edited in any Markdown editor (Obsidian)
// without touching the page templates. The templates in src/pages/ keep
// the layout and styles. See README.md for how each file is laid out.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One file per résumé entry. The folder is the section (experience,
// education, volunteering); `order` sets the position within it, lowest
// first. Numbers go up in tens so a new entry can slot in between.
const resume = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resume' }),
  schema: z.object({
    position: z.coerce.string(),
    company: z.coerce.string(),
    dates: z.coerce.string(),
    order: z.number(),
  }),
});

// One file per webring, listed on /webrings in `order` (lowest first).
// Obsidian writes an empty property as nothing at all (YAML null), so the
// optional fields accept that and treat it as blank. A ring is shown only
// when `approved` is ticked and both `previous` and `next` are filled in.
// `footer` also puts it in the site footer; keep that to the rings that
// require it (the IndieWeb ring checks the homepage), since each one is a
// footer row. The body is the one-line description.
const blank = z.string().nullish().transform((v) => v ?? '');
const webrings = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/webrings' }),
  schema: z.object({
    name: z.coerce.string(),
    home: z.string().url(),
    previous: blank,
    next: blank,
    approved: z.boolean().nullish().transform((v) => v ?? false),
    footer: z.boolean().nullish().transform((v) => v ?? false),
    footerLabel: blank,
    order: z.number().nullish().transform((v) => v ?? 100),
  }),
});

// Single-file pages: now.md and links.md.
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content' }),
});

export const collections = { resume, pages, webrings };
