// Letterboxd diary, from the public RSS feed. Shows what was watched, the
// star rating as text, and the first sentences of the review. No posters:
// the feed embeds one per entry and we deliberately drop it.

import { XMLParser } from 'fast-xml-parser';
import { fetchText, once } from './fetch';

export const LETTERBOXD_USER = 'thadeusofnaz';
const FEED = `https://letterboxd.com/${LETTERBOXD_USER}/rss/`;

export interface Film {
  title: string;
  year: string;
  /** e.g. "★★★★½"; empty string when the film was logged without a rating */
  stars: string;
  rating: number | null;
  liked: boolean;
  rewatch: boolean;
  /** ISO date, YYYY-MM-DD */
  watched: string;
  /** Plain-text excerpt of the review, possibly empty */
  excerpt: string;
  link: string;
}

function toStars(rating: number): string {
  const whole = Math.floor(rating);
  return '★'.repeat(whole) + (rating - whole >= 0.5 ? '½' : '');
}

/** Strip tags and collapse whitespace; the feed's description is HTML. */
function plainText(html: string): string {
  return html
    .replace(/<img[^>]*>/gi, '')
    .replace(/<\/p>\s*<p>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** Cut at a sentence end near `max` characters, else at a word with an ellipsis. */
function excerpt(text: string, max = 220): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const sentenceEnd = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('! '), slice.lastIndexOf('? '));
  if (sentenceEnd > max * 0.5) return slice.slice(0, sentenceEnd + 1);
  return slice.slice(0, slice.lastIndexOf(' ')) + '…';
}

export function parseFeed(xml: string): Film[] {
  const parser = new XMLParser({ ignoreAttributes: true, removeNSPrefix: false });
  const doc = parser.parse(xml);
  const raw = doc?.rss?.channel?.item;
  const items: any[] = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const films: Film[] = [];
  for (const it of items) {
    // Lists the member publishes appear in the same feed but have no film fields.
    if (!it['letterboxd:filmTitle'] || !it['letterboxd:watchedDate']) continue;
    const rating = it['letterboxd:memberRating'] != null ? Number(it['letterboxd:memberRating']) : null;
    const text = plainText(String(it.description ?? ''));
    // Entries with a rating but no written review carry the "Watched on ..."
    // boilerplate only, and reviews written from a list end with "On list: ...".
    const review = /^Watched on /.test(text) ? '' : text.replace(/\s*On list:.*$/, '').trim();
    films.push({
      title: String(it['letterboxd:filmTitle']),
      year: String(it['letterboxd:filmYear'] ?? ''),
      stars: rating != null ? toStars(rating) : '',
      rating,
      liked: it['letterboxd:memberLike'] === 'Yes',
      rewatch: it['letterboxd:rewatch'] === 'Yes',
      watched: String(it['letterboxd:watchedDate']),
      excerpt: excerpt(review),
      link: String(it.link),
    });
  }
  // The feed is newest-first already; sort defensively by watched date.
  films.sort((a, b) => (a.watched < b.watched ? 1 : a.watched > b.watched ? -1 : 0));
  return films;
}

/** The most recent diary entries, newest first. Fetched once per build. */
export function recentFilms(): Promise<Film[]> {
  return once('letterboxd', async () => parseFeed(await fetchText(FEED, 'xml')));
}
