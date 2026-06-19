import { useCallback, useEffect, useRef, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { calculateDistanceMeters } from '../lib/geo';

const SYNC_INTERVAL_MS = 3000;
const MIN_MOVEMENT_METERS = 2;
const MAX_ACCEPTABLE_ACCURACY_METERS = 500;
const SMOOTH_ALPHA = 0.35;

type BroadcasterStatus = 'idle' | 'requesting' | 'active' | 'error';

export type AccuracyLevel = 'excellent' | 'good' | 'fair' | 'poor' | 'unusable' | null;

function getAccuracyLevel(meters: number): AccuracyLevel {
  if (meters <= 15) return 'excellent';
  if (meters <= 50) return 'good';
  if (meters <= 150) return 'fair';
  if (meters <= MAX_ACCEPTABLE_ACCURACY_METERS) return 'poor';
  return 'unusable';
}

function lerp(prev: number, next: number, alpha: number): number {
  return prev + alpha * (next - prev);
}

export function useLocationBroadcaster() {
  const [status, setStatus] = useState<BroadcasterStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [lastSyncAt, setLastSyncAt] = useState<number | null>(null);
  const [accuracyLevel, setAccuracyLevel] = useState<AccuracyLevel>(null);
  const watchIdRef = useRef<number | null>(null);
  const lastWriteRef = useRef<{ latitude: number; longitude: number; time: number } | null>(null);
  const smoothedRef = useRef<{ latitude: number; longitude: number } | null>(null);

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
        const level = getAccuracyLevel(accuracy);
        setAccuracyLevel(level);

        // Block sync when accuracy is unusable to prevent garbage data
        if (level === 'unusable') {
          setSyncError(`Accuracy too low (${Math.round(accuracy)}m). Use a phone with GPS for accurate tracking.`);
          return;
        }

        // Smooth coordinates to reduce GPS jitter in broadcast data
        if (smoothedRef.current === null) {
          smoothedRef.current = { latitude, longitude };
        } else {
          smoothedRef.current = {
            latitude: lerp(smoothedRef.current.latitude, latitude, SMOOTH_ALPHA),
            longitude: lerp(smoothedRef.current.longitude, longitude, SMOOTH_ALPHA),
          };
        }

        const smoothed = smoothedRef.current;
        const now = Date.now();
        const last = lastWriteRef.current;
        const movedMeters = last
          ? calculateDistanceMeters(last, smoothed)
          : Infinity;
        const elapsedMs = last ? now - last.time : Infinity;

        if (movedMeters >= MIN_MOVEMENT_METERS || elapsedMs >= SYNC_INTERVAL_MS) {
          lastWriteRef.current = { latitude: smoothed.latitude, longitude: smoothed.longitude, time: now };
          setDoc(doc(db, 'targets', 'eusha'), {
            latitude: smoothed.latitude,
            longitude: smoothed.longitude,
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

  return { status, error, syncError, position, lastSyncAt, accuracyLevel, start };
}
