import { useEffect, useState } from 'react';

type SWStatus = 'unsupported' | 'registering' | 'ready' | 'update-available';

export function useServiceWorker() {
  const [status, setStatus] = useState<SWStatus>('registering');
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) { setStatus('unsupported'); return; }
    if (import.meta.env.DEV) { setStatus('unsupported'); return; }

    navigator.serviceWorker.register('/sw.js').then((reg) => {
      setRegistration(reg);
      setStatus('ready');
      if (reg.waiting) setStatus('update-available');
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setStatus('update-available');
          }
        });
      });
    }).catch((err) => {
      console.warn('[SW] registration failed:', err);
      setStatus('unsupported');
    });
  }, []);

  const reloadWithNewSW = () => {
    registration?.waiting?.postMessage('SKIP_WAITING');
    window.location.reload();
  };

  return { status, reloadWithNewSW };
}