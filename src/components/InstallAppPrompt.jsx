import { Download, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function InstallAppPrompt() {
  const [promptEvent, setPromptEvent] = useState(null);
  const [installed, setInstalled] = useState(window.matchMedia?.('(display-mode: standalone)').matches);

  useEffect(() => {
    const onPrompt = (event) => {
      event.preventDefault();
      setPromptEvent(event);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  async function install() {
    if (!promptEvent) return;
    promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
  }

  if (installed) {
    return (
      <span className="install-status">
        <Smartphone size={16} /> App instalada
      </span>
    );
  }

  if (!promptEvent) {
    return <span className="install-status muted-mobile">Lista para instalar en móvil</span>;
  }

  return (
    <button className="install-button" onClick={install} type="button">
      <Download size={16} /> Instalar app
    </button>
  );
}
