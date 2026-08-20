// Shared by both geocode API routes (forward + reverse) — Nominatim's usage policy
// requires a User-Agent identifying the application (browsers won't let client JS set
// this header, hence proxying server-side) and caps requests at 1/sec.
export const NOMINATIM_USER_AGENT = 'hona-tj real estate site (contact: khuvaydo@gmail.com)';

const MIN_INTERVAL_MS = 1100;
let queue: Promise<void> = Promise.resolve();
let lastRequestAt = 0;

// A single process-wide queue shared across both routes, so a forward geocode and a
// reverse geocode firing close together still can't burst past Nominatim's 1/sec cap.
export function throttleNominatim(): Promise<void> {
  const next = queue.then(async () => {
    const wait = lastRequestAt + MIN_INTERVAL_MS - Date.now();
    if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait));
    lastRequestAt = Date.now();
  });
  queue = next.catch(() => {});
  return next;
}
