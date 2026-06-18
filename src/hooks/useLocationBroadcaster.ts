import { useCallback, useEffect, useRef, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { calculateDistanceMeters } from '../lib/geo';

const SYNC_INTERVAL_MS = 3000;
const MIN_MOVEMENT_METERS = 1;

type BroadcasterStatus = 'idle' | 'requesting' | 'active' | 'error';

export function useLocationBroadcaster() {
  const [status, setStatus] = useState<BroadcasterStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [lastSyncAt, setLastSyncAt] = useState<number | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const lastWriteRef = useRef<{ latitude: number; longitude: number; time: number } | null>(null);

  const start = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported on this device.');
      setStatus('error');
      return;
    }

    setStatus('requesting');

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setStatus('active');
        setError(null);
        setPosition(pos);

        const { latitude, longitude, accuracy, speed, heading } = pos.coords;
        const now = Date.now();
        const last = lastWriteRef.current;
        const movedMeters = last
          ? calculateDistanceMeters(last, { latitude, longitude })
          : Infinity;
        const elapsedMs = last ? now - last.time : Infinity;

        if (movedMeters >= MIN_MOVEMENT_METERS || elapsedMs >= SYNC_INTERVAL_MS) {
          lastWriteRef.current = { latitude, longitude, time: now };
          setDoc(doc(db, 'targets', 'eusha'), {
            latitude,
            longitude,
            accuracy,
            timestamp: Math.floor(now / 1000),
            speed: speed ?? 0,
            heading: heading ?? 0,
          })
            .then(() => {
              setSyncError(null);
              setLastSyncAt(now);
            })
            .catch((writeError: Error) => setSyncError(writeError.message));
        }
      },
      (geoError) => {
        setError(geoError.message);
        setStatus('error');
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 },
    );
  }, []);

  useEffect(
    () => () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    },
    [],
  );

  return { status, error, syncError, position, lastSyncAt, start };
}
