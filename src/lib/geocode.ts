export interface GeocodeResult {
  lat: number;
  lng: number;
}

// Calls our own /api/geocode proxy (never Nominatim directly — see that route for why).
export async function geocodeAddress(query: string, signal?: AbortSignal): Promise<GeocodeResult | null> {
  const q = query.trim();
  if (!q) return null;

  const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`, { signal });
  if (!res.ok) return null;

  const data = (await res.json()) as { result: GeocodeResult | null };
  return data.result;
}

// Calls our own /api/geocode/reverse proxy — same rationale as geocodeAddress above.
export async function reverseGeocode(lat: number, lng: number, signal?: AbortSignal): Promise<string | null> {
  const res = await fetch(`/api/geocode/reverse?lat=${lat}&lon=${lng}`, { signal });
  if (!res.ok) return null;

  const data = (await res.json()) as { address: string | null };
  return data.address;
}
