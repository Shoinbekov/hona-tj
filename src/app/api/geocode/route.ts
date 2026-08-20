import { NextRequest, NextResponse } from 'next/server';

// Proxied server-side (rather than called directly from the browser) so we can set a
// real User-Agent — Nominatim's usage policy requires one identifying the application,
// and browsers refuse to let client JS override that header.
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'hona-tj real estate site (contact: khuvaydo@gmail.com)';
const CITY_SUFFIX = 'Душанбе, Таджикистан';

// Nominatim's usage policy caps public-instance requests at 1/sec. This process-wide
// queue serializes every geocode call through this route so concurrent form users can
// never burst past that, regardless of each client's own debounce timing.
const MIN_INTERVAL_MS = 1100;
let queue: Promise<void> = Promise.resolve();
let lastRequestAt = 0;

function throttle(): Promise<void> {
  const next = queue.then(async () => {
    const wait = lastRequestAt + MIN_INTERVAL_MS - Date.now();
    if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait));
    lastRequestAt = Date.now();
  });
  queue = next.catch(() => {});
  return next;
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim();
  if (!q) return NextResponse.json({ error: 'Missing q parameter' }, { status: 400 });

  await throttle();

  const url = new URL(NOMINATIM_URL);
  url.searchParams.set('q', `${q}, ${CITY_SUFFIX}`);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');

  let res: Response;
  try {
    res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'ru' } });
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
