// Wikimedia Commons uploads by ThadeusOfNazereth. Two uses:
//
// - "Photo of the day": one original (uncropped) upload, chosen by the
//   calendar date so it changes with the nightly rebuild, served from this
//   site at /photo-of-the-day.jpg (see src/pages/photo-of-the-day.jpg.ts)
//   so the visitor's browser never contacts Wikimedia.
// - The most recent upload, for the footer's "Currently" line.

import { decodeEntities, fetchJson, fetchOnce, once } from './fetch';

export const COMMONS_USER = 'ThadeusOfNazereth';
const API = 'https://commons.wikimedia.org/w/api.php';
/** Width of the image served on the site. Originals are 6000px wide; this is
 *  plenty, and 1280 is one of the sizes Commons keeps pre-rendered. */
const DISPLAY_WIDTH = 1280;

export interface Upload {
  /** File name without the "File:" prefix, underscores included */
  name: string;
  title: string;
  /** ISO timestamp of the upload */
  timestamp: string;
  pageUrl: string;
  width: number;
  height: number;
  mime: string;
}

export interface Photo extends Upload {
  /** Plain-text caption from the file description, or the file name */
  caption: string;
  /** URL of the resized file on upload.wikimedia.org (fetched at build time, not by visitors) */
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  license: string;
  /** When the photo was taken, if the file page records it */
  taken: string | null;
}

interface AllImagesResponse {
  query: {
    allimages: Array<{
      name: string;
      title: string;
      timestamp: string;
      descriptionurl: string;
      width: number;
      height: number;
      mime: string;
    }>;
  };
  continue?: Record<string, string>;
}

/** Every file the account has uploaded, newest first. */
export function uploads(): Promise<Upload[]> {
  return once('commons:uploads', async () => {
    const all: Upload[] = [];
    let cont: Record<string, string> = {};
    do {
      const params = new URLSearchParams({
        action: 'query',
        list: 'allimages',
        aiuser: COMMONS_USER,
        aisort: 'timestamp',
        aidir: 'descending',
        ailimit: '500',
        aiprop: 'timestamp|url|size|mime',
        format: 'json',
        formatversion: '2',
        ...cont,
      });
      const data = await fetchJson<AllImagesResponse>(`${API}?${params}`);
      for (const f of data.query.allimages) {
        all.push({
          name: f.name,
          title: f.title.replace(/^File:/, ''),
          timestamp: f.timestamp,
          pageUrl: f.descriptionurl,
          width: f.width,
          height: f.height,
          mime: f.mime,
        });
      }
      cont = data.continue ?? {};
    } while (Object.keys(cont).length);
    return all;
  });
}

/** Originals only: photographs, not the crops made from them for infoboxes. */
export function isOriginalPhoto(u: Upload): boolean {
  return /^image\/(jpeg|png)$/.test(u.mime) && !/crop/i.test(u.name) && u.width >= 1000;
}

/** Day number since the epoch, in UTC, so the pick is stable for a calendar day. */
function dayNumber(date = new Date()): number {
  return Math.floor(date.getTime() / 86_400_000);
}

interface ImageInfoResponse {
  query: {
    pages: Array<{
      title: string;
      imageinfo: Array<{
        thumburl: string;
        thumbwidth: number;
        thumbheight: number;
        extmetadata?: Record<string, { value: string }>;
      }>;
    }>;
  };
}

function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
}

function nameToCaption(name: string): string {
  return name.replace(/\.[a-z0-9]+$/i, '').replace(/_/g, ' ');
}

/** Today's photo, with caption and a resized image URL. Fetched once per build. */
export function photoOfTheDay(): Promise<Photo> {
  return once('commons:photo', async () => {
    const originals = (await uploads()).filter(isOriginalPhoto);
    if (originals.length === 0) throw new Error('Commons: no original photos found to choose from');
    // Oldest-first before indexing, so the sequence is stable as new uploads arrive.
    originals.reverse();
    const pick = originals[dayNumber() % originals.length];

    const params = new URLSearchParams({
      action: 'query',
      prop: 'imageinfo',
      titles: `File:${pick.name}`,
      iiprop: 'url|extmetadata',
      iiurlwidth: String(DISPLAY_WIDTH),
      iiextmetadatafilter: 'ImageDescription|DateTimeOriginal|LicenseShortName',
      format: 'json',
      formatversion: '2',
    });
    const data = await fetchJson<ImageInfoResponse>(`${API}?${params}`);
    const info = data.query.pages[0]?.imageinfo?.[0];
    if (!info?.thumburl) throw new Error(`Commons: no image info for ${pick.name}`);
    const meta = info.extmetadata ?? {};
    const description = meta.ImageDescription ? stripHtml(meta.ImageDescription.value) : '';
    return {
      ...pick,
      caption: description || nameToCaption(pick.name),
      imageUrl: info.thumburl,
      imageWidth: info.thumbwidth,
      imageHeight: info.thumbheight,
      license: meta.LicenseShortName?.value ?? '',
      taken: meta.DateTimeOriginal ? stripHtml(meta.DateTimeOriginal.value).slice(0, 10) : null,
    };
  });
}

/** The bytes of today's photo, resized, for the /photo-of-the-day.jpg endpoint. */
export async function photoOfTheDayBytes(): Promise<Uint8Array> {
  const photo = await photoOfTheDay();
  return fetchOnce(photo.imageUrl, 'jpg');
}

/** Most recent upload of any kind, for the footer. */
export async function latestUpload(): Promise<Upload> {
  const all = await uploads();
  if (all.length === 0) throw new Error('Commons: no uploads found');
  return all[0];
}
