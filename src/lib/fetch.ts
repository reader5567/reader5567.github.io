// Build-time fetching. Nothing here runs in the visitor's browser: Astro
// calls these functions while generating the static pages, and the results
// are baked into plain HTML.
//
// Two rules, both deliberate:
//
// 1. A failed fetch throws, so the whole build fails. On GitHub Pages a
//    failed build means the previous good version keeps being served,
//    which is better than publishing a page with a hole in it.
// 2. Each URL is fetched at most once per build (results are memoized), so
//    a component used on every page does not re-request its data per page.
//
// For working offline, set FETCH_CACHE_DIR to a folder: responses are
// read from and written to <dir>/<sha1 of URL>.<ext>. The folder is
// gitignored; the GitHub Actions build never sets the variable.

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Wikimedia's User-Agent policy wants a descriptive agent with contact
// details; Letterboxd is happy with the same string.
export const USER_AGENT =
  'thadeussmith.com-build-bot/1.0 (https://thadeussmith.com; thadhsmith13@gmail.com) PersonalSite';

const inflight = new Map<string, Promise<Uint8Array>>();

function cachePath(url: string, ext: string): string | null {
  const dir = process.env.FETCH_CACHE_DIR;
  if (!dir) return null;
  mkdirSync(dir, { recursive: true });
  return join(dir, createHash('sha1').update(url).digest('hex') + '.' + ext);
}

async function fetchBytes(url: string, ext: string): Promise<Uint8Array> {
  const cached = cachePath(url, ext);
  if (cached && existsSync(cached)) return new Uint8Array(readFileSync(cached));

  const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status} ${response.statusText} for ${url}`);
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (cached) writeFileSync(cached, bytes);
  return bytes;
}

/** Fetch a URL once per build and return its body as bytes. */
export function fetchOnce(url: string, ext = 'bin'): Promise<Uint8Array> {
  let p = inflight.get(url);
  if (!p) {
    p = fetchBytes(url, ext);
    inflight.set(url, p);
  }
  return p;
}

/** Fetch a URL once per build and return its body as UTF-8 text. */
export async function fetchText(url: string, ext = 'txt'): Promise<string> {
  return new TextDecoder('utf-8').decode(await fetchOnce(url, ext));
}

/** Fetch a URL once per build and parse the body as JSON. */
export async function fetchJson<T = unknown>(url: string): Promise<T> {
  return JSON.parse(await fetchText(url, 'json')) as T;
}

/** Memoize an arbitrary async computation for the duration of the build. */
const memo = new Map<string, Promise<unknown>>();
export function once<T>(key: string, compute: () => Promise<T>): Promise<T> {
  let p = memo.get(key) as Promise<T> | undefined;
  if (!p) {
    p = compute();
    memo.set(key, p);
  }
  return p;
}

// Named character references that turn up in feeds and API text.
const NAMED_ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

/**
 * Turn HTML character references back into characters: &amp; &#039; &#39;
 * &#x27; and the like. One pass, so "&amp;#039;" correctly becomes the
 * literal text "&#039;" rather than being decoded twice. Unknown names are
 * left alone.
 */
export function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, ref: string) => {
    if (ref[0] === '#') {
      const code = ref[1] === 'x' || ref[1] === 'X' ? parseInt(ref.slice(2), 16) : parseInt(ref.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    }
    return NAMED_ENTITIES[ref.toLowerCase()] ?? match;
  });
}

/** Format an ISO date (or date-time) as e.g. "Oct 23, 2026". */
export function shortDate(iso: string): string {
  const d = new Date(iso.length === 10 ? iso + 'T12:00:00Z' : iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}
