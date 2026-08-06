export function createLocalStore<T>(key: string, fallback: T) {
  let cached: T = fallback;
  let initialized = false;
  const listeners = new Set<() => void>();

  function read(): T {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  function getSnapshot(): T {
    if (!initialized) {
      cached = read();
      initialized = true;
    }
    return cached;
  }

  function getServerSnapshot(): T {
    return fallback;
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function set(value: T) {
    cached = value;
    initialized = true;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
    listeners.forEach((listener) => listener());
  }

  return { getSnapshot, getServerSnapshot, subscribe, set };
}
