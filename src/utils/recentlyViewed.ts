/**
 * Recently Viewed Products Utility
 * Tracks and persists the last 4 products viewed by the user.
 */

const STORAGE_KEY = 'nexora_recently_viewed_v1';
const MAX_RECENTLY_VIEWED = 4;
const EVENT_NAME = 'nexora:recently-viewed-updated';

export const getRecentlyViewedIds = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.slice(0, MAX_RECENTLY_VIEWED);
    }
    return [];
  } catch {
    return [];
  }
};

export const recordRecentlyViewed = (productId: string): void => {
  if (!productId || typeof productId !== 'string') return;
  try {
    const current = getRecentlyViewedIds();
    // Move to front if exists, otherwise prepend
    const updated = [productId, ...current.filter(id => id !== productId)].slice(0, MAX_RECENTLY_VIEWED);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { ids: updated } }));
  } catch {
    // Storage unavailable or full
  }
};

export const clearRecentlyViewed = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { ids: [] } }));
  } catch {
    // Ignore
  }
};

export const onRecentlyViewedChange = (callback: (ids: string[]) => void): (() => void) => {
  const handler = (e: Event) => {
    const custom = e as CustomEvent<{ ids: string[] }>;
    callback(custom.detail?.ids || getRecentlyViewedIds());
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
};
