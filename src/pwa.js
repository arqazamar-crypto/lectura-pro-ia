export function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || import.meta.env.DEV) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      registration.update();
      notifyIfUpdateIsWaiting(registration);

      registration.addEventListener('updatefound', () => {
        const nextWorker = registration.installing;
        if (!nextWorker) return;

        nextWorker.addEventListener('statechange', () => {
          if (nextWorker.state === 'installed' && navigator.serviceWorker.controller) {
            window.dispatchEvent(new CustomEvent('lectura-pro-update', { detail: { registration } }));
          }
        });
      });

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          registration.update().then(() => notifyIfUpdateIsWaiting(registration)).catch(() => {});
        }
      });
    }).catch(() => {});
  });
}

export function applyServiceWorkerUpdate(registration) {
  const waitingWorker = registration?.waiting || registration?.installing;
  if (!waitingWorker) {
    window.location.reload();
    return;
  }

  let refreshed = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshed) return;
    refreshed = true;
    window.location.reload();
  });

  waitingWorker.postMessage({ type: 'SKIP_WAITING' });
}

function notifyIfUpdateIsWaiting(registration) {
  if (registration.waiting && navigator.serviceWorker.controller) {
    window.dispatchEvent(new CustomEvent('lectura-pro-update', { detail: { registration } }));
  }
}
