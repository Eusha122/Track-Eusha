import { useEffect, useRef, useState } from 'react';
import type { Coordinates } from '../lib/geo';
import { calculateDistanceMeters } from '../lib/geo';

// Adaptive smoothing: responsive when moving, stable when still
const ALPHA_MOVING = 0.6;   // React quickly to real movement
const ALPHA_STILL = 0.15;   // Suppress jitter when stationary
const MOVEMENT_THRESHOLD_M = 3; // Below this = standing still

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

        if (smoothedRef.current === null) {
          smoothedRef.current = raw;
        } else {
          // Pick alpha based on how far the raw reading is from smoothed
          const jump = calculateDistanceMeters(smoothedRef.current, raw);
          const alpha = jump > MOVEMENT_THRESHOLD_M ? ALPHA_MOVING : ALPHA_STILL;

          smoothedRef.current = {
            latitude: lerp(smoothedRef.current.latitude, raw.latitude, alpha),
            longitude: lerp(smoothedRef.current.longitude, raw.longitude, alpha),
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
