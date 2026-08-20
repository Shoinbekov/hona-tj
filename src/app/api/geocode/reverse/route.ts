import { NextRequest, NextResponse } from 'next/server';
import { NOMINATIM_USER_AGENT, throttleNominatim } from '@/lib/server/nominatim';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

interface NominatimReverseResponse {
  display_name?: string;
  address?: { road?: string; house_number?: string };
}

// Prefer "street + house number" (matches what the address field/forward geocoding
// expects) and fall back to Nominatim's full display_name when that's unavailable —
// e.g. a click on empty land with no addressed road nearby.
function pickAddress(data: NominatimReverseResponse): string | null {
  const road = data.address?.road;
  if (road) return data.address?.house_number ? `${road} ${data.address.house_number}` : road;
  return data.display_name ?? null;
}

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get('lat');
  const lon = request.nextUrl.searchParams.get('lon');
  if (!lat || !lon) return NextResponse.json({ error: 'Missing lat/lon parameter' }, { status: 400 });

  await throttleNominatim();

  const url = new URL(NOMINATIM_URL);
  url.searchParams.set('lat', lat);
  url.searchParams.set('lon', lon);
  url.searchParams.set('format', 'json');

  let res: Response;
  try {
    res = await fetch(url, { headers: { 'User-Agent': NOMINATIM_USER_AGENT, 'Accept-Language': 'ru' } });
  } catch (err) {
    console.error('[api/geocode/reverse] Nominatim request failed:', err);
    return NextResponse.json({ error: 'Geocoding service unreachable' }, { status: 502 });
  }

  if (!res.ok) {
    console.error('[api/geocode/reverse] Nominatim returned', res.status);
    return NextResponse.json({ error: 'Geocoding service error' }, { status: 502 });
  }

  const data = (await res.json()) as NominatimReverseResponse;
  return NextResponse.json({ address: pickAddress(data) });
}
