// The words on the Résumé, Now and Links pages live as Markdown in
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

// Single-file pages: now.md and links.md.
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content' }),
});

export const collections = { resume, pages };
