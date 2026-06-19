import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useInterval } from './useInterval';
import { readCachedTarget, writeCachedTarget } from '../lib/storage';

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
  // Seed from localStorage so a fresh page load shows the last known fix
  // immediately instead of "no data" while the first snapshot is in flight.
  const [target, setTarget] = useState<TargetLocation | null>(() =>
    readCachedTarget<TargetLocation>(),
  );
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
          // The tracker stopped writing (or the doc was never created) —
          // keep showing the last known position rather than clearing it.
          return;
        }
        const data = snapshot.data();
        const next: TargetLocation = {
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: data.accuracy,
          timestamp: data.timestamp,
          speed: data.speed,
          heading: data.heading,
        };
        setTarget(next);
        writeCachedTarget(next);
      },
      (snapshotError) => setError(snapshotError.message),
    );

    return unsubscribe;
  }, []);

  const isOffline = target !== null && now / 1000 - target.timestamp > OFFLINE_THRESHOLD_SECONDS;

  return { target, error, isOffline };
}
