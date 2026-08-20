import { NextRequest, NextResponse } from 'next/server';
import { NOMINATIM_USER_AGENT, throttleNominatim } from '@/lib/server/nominatim';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const CITY_SUFFIX = 'Душанбе, Таджикистан';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim();
  if (!q) return NextResponse.json({ error: 'Missing q parameter' }, { status: 400 });

  await throttleNominatim();

  const url = new URL(NOMINATIM_URL);
  url.searchParams.set('q', `${q}, ${CITY_SUFFIX}`);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');

  let res: Response;
  try {
    res = await fetch(url, { headers: { 'User-Agent': NOMINATIM_USER_AGENT, 'Accept-Language': 'ru' } });
  } catch (err) {
    console.error('[api/geocode] Nominatim request failed:', err);
    return NextResponse.json({ error: 'Geocoding service unreachable' }, { status: 502 });
  }

  if (!res.ok) {
    console.error('[api/geocode] Nominatim returned', res.status);
    return NextResponse.json({ error: 'Geocoding service error' }, { status: 502 });
  }

  const data = (await res.json()) as Array<{ lat: string; lon: string }>;
  if (data.length === 0) return NextResponse.json({ result: null });

  const { lat, lon } = data[0];
  return NextResponse.json({ result: { lat: parseFloat(lat), lng: parseFloat(lon) } });
}
