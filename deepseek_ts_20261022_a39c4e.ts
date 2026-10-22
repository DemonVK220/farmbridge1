import { useState, useCallback } from 'react';

const KEY = 'farmbridge.searchHistory';
const MAX = 6;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch { return []; }
  });

  const persist = (next: string[]) => {
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    setHistory(next);
  };

  const add = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setHistory((prev) => {
      const next = [trimmed, ...prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const remove = useCallback((query: string) => {
    setHistory((prev) => {
      const next = prev.filter((q) => q !== query);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const clear = useCallback(() => persist([]), []);

  return { history, add, remove, clear };
}