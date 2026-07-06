export interface ExchangeRates {
  USD_TO_TJS: number;
  USD_TO_RUB: number;
}

// Used when the API is unreachable and there's no usable cache yet
export const FALLBACK_RATES: ExchangeRates = {
  USD_TO_TJS: 9.28,
  USD_TO_RUB: 77.3,
};

const CACHE_KEY = 'hona_exchange_rates';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;

interface CachedRates extends ExchangeRates {
  fetchedAt: number;
}

function readCache(): CachedRates | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.USD_TO_TJS !== 'number' || typeof parsed?.USD_TO_RUB !== 'number' || typeof parsed?.fetchedAt !== 'number') {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(rates: ExchangeRates) {
  if (typeof window === 'undefined') return;
  try {
    const cached: CachedRates = { ...rates, fetchedAt: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
  } catch {
    // localStorage unavailable (private mode / quota) — rates just won't persist across reloads
  }
}

function isFresh(cached: CachedRates): boolean {
  return Date.now() - cached.fetchedAt < CACHE_TTL_MS;
}

async function fetchRatesFromApi(): Promise<ExchangeRates> {
  const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);
  if (!res.ok) throw new Error(`ExchangeRate API HTTP ${res.status}`);

  const data = await res.json();
  if (data.result !== 'success') throw new Error(`ExchangeRate API result: ${data.result}`);

  const { TJS, RUB } = data.conversion_rates ?? {};
  if (typeof TJS !== 'number' || typeof RUB !== 'number') throw new Error('ExchangeRate API response missing TJS/RUB rates');

  return { USD_TO_TJS: TJS, USD_TO_RUB: RUB };
}

// Returns the cached rates instantly if they're under 24h old. Otherwise fetches fresh
// rates from the API and caches them. If the API call fails, falls back to the last
// known rates, or the hardcoded defaults if nothing was ever cached.
export async function getExchangeRates(): Promise<ExchangeRates> {
  const cached = readCache();
  if (cached && isFresh(cached)) {
    return { USD_TO_TJS: cached.USD_TO_TJS, USD_TO_RUB: cached.USD_TO_RUB };
  }

  try {
    const rates = await fetchRatesFromApi();
    writeCache(rates);
    return rates;
  } catch {
    if (cached) return { USD_TO_TJS: cached.USD_TO_TJS, USD_TO_RUB: cached.USD_TO_RUB };
    return FALLBACK_RATES;
  }
}
