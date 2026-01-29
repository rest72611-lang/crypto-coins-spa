// Centralized keys used for LocalStorage access
export const StorageKeys = {
  SelectedCoinIds: "selectedCoinIds",
  MoreInfoCache: "moreInfoCache",
} as const;

// Save a value to LocalStorage (serialized as JSON)
export function setToStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Read a value from LocalStorage and parse JSON
// Returns fallback if key does not exist or parsing fails
export function getFromStorage<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// Generic cache entry type with expiration
export type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

// Validates whether a cache entry exists and is not expired
export function isValid(entry?: CacheEntry<any> | null): boolean {
  return !!entry && entry.expiresAt > Date.now();
}



