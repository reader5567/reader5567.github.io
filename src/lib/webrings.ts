// The webrings from src/content/webrings/ that are ready to show:
// approved, with both neighbor links filled in, sorted by `order`.
import { getCollection } from 'astro:content';

export async function activeWebrings() {
  const all = await getCollection('webrings');
  return all
    .filter((r) => r.data.approved && r.data.previous && r.data.next)
    .sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name));
}
