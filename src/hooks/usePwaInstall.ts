import { useEffect, useState } from "react";

export type InstallEvent = Event & { prompt: () => Promise<void> };

export function usePwaInstall() {
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);

  useEffect(() => {
    if (import.meta.env.DEV) {
      navigator.serviceWorker
        ?.getRegistrations()
        .then((registrations) =>
          registrations.forEach((registration) => registration.unregister()),
        );
      return;
    }

    navigator.serviceWorker?.register("/service-worker.js");
    const onInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallEvent);
    };
    window.addEventListener("beforeinstallprompt", onInstall);
    return () => window.removeEventListener("beforeinstallprompt", onInstall);
  }, []);

  return { installEvent, clearInstallEvent: () => setInstallEvent(null) };
}
