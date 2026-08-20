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
