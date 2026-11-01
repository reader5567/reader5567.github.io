// Which pages actually exist in this build, so the sitemap and the footer's
// Extras row only ever link to live pages. A page counts once it has a
// template in src/pages/ or, for a text page (`text: true` in src/site.ts),
// once its Markdown file sits directly in src/content/. Runs at build time.
import { getCollection } from 'astro:content';
import { site, type PageInfo } from '../site';

export type LivePage = { path: string; info?: PageInfo };

// Every template directly in src/pages/, as a path: index.astro is "/",
// now.astro is "/now". The 404 page and the [page].astro template (whose
// pages come from src/content/) are not pages to link to.
const templates = Object.keys(import.meta.glob('../pages/*.astro'))
  .map((file) => file.replace('../pages/', '').replace(/\.astro$/, ''))
  .filter((name) => name !== '404' && !name.startsWith('['))
  .map((name) => (name === 'index' ? '/' : '/' + name));

export const livePages = once(async (): Promise<LivePage[]> => {
  const texts = (await getCollection('pages'))
    .map((file) => '/' + file.id)
    .filter((path) => site.pages[path]?.text);
  const paths = [...new Set([...templates, ...texts])];
  return paths.map((path) => ({ path, info: site.pages[path] }));
});

/** The pages for the footer's Extras row, alphabetically. */
export async function extraPages(): Promise<LivePage[]> {
  return (await livePages())
    .filter((p) => p.info?.extra)
    .sort((a, b) => a.info!.label.localeCompare(b.info!.label));
}

function once<T>(compute: () => Promise<T>): () => Promise<T> {
  let p: Promise<T> | undefined;
  return () => (p ??= compute());
}
