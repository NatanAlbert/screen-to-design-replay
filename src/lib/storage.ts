import { useCallback, useEffect, useState } from "react";

const listeners = new Map<string, Set<() => void>>();

/** Browser-local persisted state, hydration-safe (reads after mount), synced across hooks. */
export function useLocal<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem(key);
        if (raw != null) setValue(JSON.parse(raw));
      } catch { /* ignore corrupt entries */ }
    };
    read();
    setReady(true);
    const set = listeners.get(key) ?? new Set();
    set.add(read);
    listeners.set(key, set);
    return () => { set.delete(read); };
  }, [key]);

  const update = useCallback((next: T | ((p: T) => T)) => {
    setValue((prev) => {
      const v = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* quota */ }
      queueMicrotask(() => listeners.get(key)?.forEach((fn) => fn()));
      return v;
    });
  }, [key]);

  return [value, update, ready] as const;
}

export const KEYS = {
  lang: "vanta.lang",
  favorites: "vanta.favorites",
  saved: "vanta.saved",
  current: "vanta.current",
};
