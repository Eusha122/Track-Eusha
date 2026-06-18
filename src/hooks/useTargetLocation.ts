import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useInterval } from './useInterval';

export interface TargetLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  speed: number;
  heading: number;
}

const OFFLINE_THRESHOLD_SECONDS = 60;

export function useTargetLocation() {
  const [target, setTarget] = useState<TargetLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  // Ticks so offline status updates even if no new snapshot ever arrives.
  useInterval(() => setNow(Date.now()), 1000);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'targets', 'eusha'),
      (snapshot) => {
        setError(null);
        if (!snapshot.exists()) {
          setTarget(null);
          return;
        }
        const data = snapshot.data();
        setTarget({
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: data.accuracy,
          timestamp: data.timestamp,
          speed: data.speed,
          heading: data.heading,
        });
      },
      (snapshotError) => setError(snapshotError.message),
    );

    return unsubscribe;
  }, []);

  const isOffline = target !== null && now / 1000 - target.timestamp > OFFLINE_THRESHOLD_SECONDS;

  return { target, error, isOffline };
}
