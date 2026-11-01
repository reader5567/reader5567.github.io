// The accounts in src/content/accounts/, in footer `order` (lowest first).
// The footer, the <head> rel="me" links and /verify all read from here, so
// an account is added or changed in one place.
import { getCollection } from 'astro:content';

export async function accounts() {
  const all = await getCollection('accounts');
  return all
    .map((a) => a.data)
    .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
}
