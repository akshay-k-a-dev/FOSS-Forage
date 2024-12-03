// Cache duration in milliseconds
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CacheItem<T> {
  value: T;
  expiry: number;
}

export class BrowserCache {
  async get<T>(key: string): Promise<T | null> {
    if (typeof window === 'undefined') return null;
    
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    try {
      const parsed = JSON.parse(item);
      if (Date.now() > parsed.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed.value;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlMs: number = CACHE_DURATION): Promise<void> {
    if (typeof window === 'undefined') return;
    
    const item = {
      value,
      expiry: Date.now() + ttlMs,
    };
    
    localStorage.setItem(key, JSON.stringify(item));
  }

  async delete(key: string): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
}
