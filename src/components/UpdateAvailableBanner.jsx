import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { applyServiceWorkerUpdate } from '../pwa';

export default function UpdateAvailableBanner() {
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    const onUpdate = (event) => setRegistration(event.detail.registration);
    window.addEventListener('lectura-pro-update', onUpdate);
    return () => window.removeEventListener('lectura-pro-update', onUpdate);
  }, []);

  if (!registration) return null;

  return (
    <div className="update-banner" role="status" onClick={() => applyServiceWorkerUpdate(registration)}>
      <span>Nueva versión disponible. Toca para actualizar.</span>
      <button type="button" aria-label="Actualizar aplicación">
        <RefreshCw size={16} /> Actualizar
      </button>
    </div>
  );
}
