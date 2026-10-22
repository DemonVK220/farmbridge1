import { useState, useEffect, useRef } from 'react';

export function useSimulatedLoad<T>(data: T, deps: any[] = [], delayMs: number = 400): { data: T; isLoading: boolean } {
  const [isLoading, setIsLoading] = useState(true);
  const [returned, setReturned] = useState<T>(data);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRun = useRef(true);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (firstRun.current) {
      firstRun.current = false;
      setReturned(data);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    timer.current = setTimeout(() => {
      setReturned(data);
      setIsLoading(false);
    }, delayMs);
    return () => { if (timer.current) clearTimeout(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data: returned, isLoading };
}