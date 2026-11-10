// English Wikipedia. Two uses:
//
// - The "Contributions" (or "My contributions") section of
//   User:ThadeusOfNazereth, which is the single source of truth for the list
//   of articles on the Writing page. The site renders that section's
//   groupings as they appear on the user page; nothing else from the page is
//   pulled in.
// - The most recently edited article, for the footer's "Currently" line.

import { fetchJson, once } from './fetch';

export const WIKIPEDIA_USER = 'ThadeusOfNazereth';
const API = 'https://en.wikipedia.org/w/api.php';
export const USER_PAGE_URL = `https://en.wikipedia.org/wiki/User:${WIKIPEDIA_USER}`;

export interface Article {
  title: string;
  url: string;
  /** Assessment shown on the user page: "GA", "FA", "FL", "A" or empty */
  rating: string;
  /** Appeared on the Main Page's "Did you know" */
  dyk: boolean;
  /** Parenthetical remark from the user page, e.g. "translated from Spanish", or empty */
  note: string;
  /** Works (books, films, plays) are marked ''like this'' on the user page */
  italic: boolean;
  /** The part of the title to italicize, e.g. "Sam" in "Sam (Goodman novel)" */
  main: string;
  /** Text after `main`, e.g. " (Goodman novel)"; empty when the whole title is italic */
  suffix: string;
}

export interface ContributionGroup {
  heading: string;
  articles: Article[];
}

const RATING_LABELS: Record<string, string> = { fa: 'FA', fl: 'FL', ga: 'GA', a: 'A' };

export function articleUrl(title: string): string {
  return 'https://en.wikipedia.org/wiki/' + encodeURIComponent(title.replace(/ /g, '_')).replace(/%3A/g, ':').replace(/%2C/g, ',').replace(/%28/g, '(').replace(/%29/g, ')');
}

/** Reduce a fragment of wikitext to plain text: links to their label, templates to their last argument. */
function plain(wikitext: string): string {
  return wikitext
    .replace(/\{\{\s*u\s*\|([^}]*)\}\}/gi, '$1')
    .replace(/\{\{[^}]*\|([^}|]*)\}\}/g, '$1')
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/\[\[([^\]|]*)\|([^\]]*)\]\]/g, '$2')
    .replace(/\[\[([^\]]*)\]\]/g, '$1')
    .replace(/'{2,}/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Wikipedia style italicizes a work's title but not the disambiguator after
// it: ''Sam'' (Goodman novel). The user page is not consistent about where
// the quote marks go, so the disambiguator is recognised by its wording
// rather than by the markup. "(-noun)" in a play's title is not matched.
const DISAMBIGUATOR = /^(.*?)(\s\([^()]*\b(?:novel|novella|book|play|film|poem|memoir|collection|story)\))$/i;

function splitTitle(raw: string): Pick<Article, 'italic' | 'main' | 'suffix'> {
  if (!raw.includes("''")) return { italic: false, main: raw, suffix: '' };
  const title = raw.replace(/'{2,}/g, '').trim();
  const m = title.match(DISAMBIGUATOR);
  return m ? { italic: true, main: m[1], suffix: m[2] } : { italic: true, main: title, suffix: '' };
}

// The section heading. Either name is accepted so a small rename on the user
// page doesn't take the whole site build down.
const SECTION_HEADING = /^==\s*(?:My\s+)?contributions\s*==\s*$/im;

/**
 * One list line of the section. Two shapes are accepted:
 *   * {{icon link|ga|Title}} (note)
 *   * {{icon|dyk}} ''[[Title]]'' (note)   or   [[Target|''Label'']]
 * Returns null for lines that hold no article link.
 */
function parseLine(line: string): Article | null {
  const dyk = /\{\{\s*icon\s*\|\s*dyk\s*\}\}/i.test(line);

  const iconLink = line.match(/\{\{\s*icon link\s*\|\s*([^|}]*)\s*\|\s*([^}]*)\}\}/i);
  if (iconLink) {
    const raw = iconLink[2].trim();
    const title = raw.replace(/'{2,}/g, '').trim();
    const after = line.slice(line.indexOf(iconLink[0]) + iconLink[0].length);
    return {
      title,
      url: articleUrl(title),
      rating: RATING_LABELS[iconLink[1].trim().toLowerCase()] ?? '',
      dyk,
      note: noteFrom(after),
      ...splitTitle(raw),
    };
  }

  const wikilink = line.match(/\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/);
  if (!wikilink) return null;
  const title = wikilink[1].trim();
  const at = line.indexOf(wikilink[0]);
  const before = line.slice(0, at);
  const after = line.slice(at + wikilink[0].length);
  // Italic either around the link (''[[Title]]'') or inside its label ([[Target|''Label'']]).
  const italic = /''\s*$/.test(before) || (wikilink[2] ?? '').includes("''");
  return {
    title,
    url: articleUrl(title),
    rating: '',
    dyk,
    note: noteFrom(after),
    ...splitTitle(italic ? `''${title}''` : title),
  };
}

/** The parenthetical after a link, e.g. "(translated from Spanish)" → "translated from Spanish". */
function noteFrom(after: string): string {
  return plain(after).replace(/^\(|\)$/g, '').trim();
}

/** Parse the contributions section of the user page's wikitext. Exported for testing. */
export function parseContributions(wikitext: string): ContributionGroup[] {
  const start = wikitext.search(SECTION_HEADING);
  if (start < 0) throw new Error('Wikipedia: "Contributions" section not found on the user page');
  const rest = wikitext.slice(start).split('\n').slice(1);
  const groups: ContributionGroup[] = [];
  let current: ContributionGroup | null = null;
  for (const line of rest) {
    if (/^==[^=]/.test(line)) break; // next level-2 section ends ours
    const h3 = line.match(/^===\s*(.+?)\s*===\s*$/);
    if (h3) {
      current = { heading: h3[1], articles: [] };
      groups.push(current);
      continue;
    }
    if (!current || !line.startsWith('*')) continue;
    const article = parseLine(line);
    if (article) current.articles.push(article);
  }
  const populated = groups.filter((g) => g.articles.length > 0);
  if (populated.length === 0) throw new Error('Wikipedia: no articles parsed from "Contributions"');
  return populated;
}

interface ParseResponse {
  parse: { wikitext: string };
}

/** The contribution groups from the user page. Fetched once per build. */
export function contributions(): Promise<ContributionGroup[]> {
  return once('wikipedia:contributions', async () => {
    const params = new URLSearchParams({
      action: 'parse',
      page: `User:${WIKIPEDIA_USER}`,
      prop: 'wikitext',
      format: 'json',
      formatversion: '2',
    });
    const data = await fetchJson<ParseResponse>(`${API}?${params}`);
    return parseContributions(data.parse.wikitext);
  });
}

export interface Edit {
  title: string;
  url: string;
  timestamp: string;
}

interface ContribsResponse {
  query: { usercontribs: Array<{ title: string; timestamp: string }> };
}

/** The most recently edited article (main namespace), for the footer. */
export function latestEdit(): Promise<Edit> {
  return once('wikipedia:latest-edit', async () => {
    const params = new URLSearchParams({
      action: 'query',
      list: 'usercontribs',
      ucuser: WIKIPEDIA_USER,
      ucnamespace: '0',
      uclimit: '1',
      ucprop: 'title|timestamp',
      format: 'json',
      formatversion: '2',
    });
    const data = await fetchJson<ContribsResponse>(`${API}?${params}`);
    const e = data.query.usercontribs[0];
    if (!e) throw new Error('Wikipedia: no recent article edits found');
    return { title: e.title, url: articleUrl(e.title), timestamp: e.timestamp };
  });
}
