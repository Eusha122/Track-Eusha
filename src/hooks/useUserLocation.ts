import { useEffect, useRef, useState } from 'react';
import type { Coordinates } from '../lib/geo';

// Exponential moving average smoothing factor.
// Lower = smoother but laggier. 0.3 is a good balance for GPS jitter.
const SMOOTH_ALPHA = 0.3;

function lerp(prev: number, next: number, alpha: number): number {
  return prev + alpha * (next - prev);
}

export function useUserLocation() {
  const [position, setPosition] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(() =>
    'geolocation' in navigator ? null : 'Geolocation is not supported on this device.',
  );
  const watchIdRef = useRef<number | null>(null);
  const smoothedRef = useRef<Coordinates | null>(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setError(null);
        const raw = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };

        // Apply exponential moving average to smooth out GPS jitter
        if (smoothedRef.current === null) {
          smoothedRef.current = raw;
        } else {
          smoothedRef.current = {
            latitude: lerp(smoothedRef.current.latitude, raw.latitude, SMOOTH_ALPHA),
            longitude: lerp(smoothedRef.current.longitude, raw.longitude, SMOOTH_ALPHA),
          };
        }

        setPosition({ ...smoothedRef.current });
      },
      (geoError) => setError(geoError.message),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 },
    );

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  return { position, error, ready: position !== null };
}
