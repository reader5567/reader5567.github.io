// Serves today's Commons photo from this site's own origin. The bytes are
// fetched once at build time (see src/lib/commons.ts), so the visitor's
// browser never makes a request to Wikimedia.

import type { APIRoute } from 'astro';
import { photoOfTheDayBytes } from '../lib/commons';

export const GET: APIRoute = async () => {
  const bytes = await photoOfTheDayBytes();
  return new Response(bytes, { headers: { 'Content-Type': 'image/jpeg' } });
};
