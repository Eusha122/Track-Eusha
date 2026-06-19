const LAST_KNOWN_TARGET_KEY = 'eusha-locator:last-known-target';

export function readCachedTarget<T>(): T | null {
  try {
    const raw = localStorage.getItem(LAST_KNOWN_TARGET_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeCachedTarget(value: unknown) {
  try {
    localStorage.setItem(LAST_KNOWN_TARGET_KEY, JSON.stringify(value));
  } catch {
    // Private browsing / storage disabled — fall back to in-memory only.
  }
}
