import { useEffect, useRef, useState } from 'react';
import type { Coordinates } from '../lib/geo';

export function useUserLocation() {
  const [position, setPosition] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(() =>
    'geolocation' in navigator ? null : 'Geolocation is not supported on this device.',
  );
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setError(null);
        setPosition({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      },
      (geoError) => setError(geoError.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  return { position, error, ready: position !== null };
}
