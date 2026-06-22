import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useInterval } from './useInterval';

export interface HunterLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  speed: number;
  heading: number;
}

const OFFLINE_THRESHOLD_SECONDS = 60;

export function useHunterLocation() {
  const [hunter, setHunter] = useState<HunterLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  // Tick so offline status updates even if no new snapshot arrives.
  useInterval(() => setNow(Date.now()), 1000);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'targets', 'tasmia'),
      (snapshot) => {
        setError(null);
        if (!snapshot.exists()) return;
        const data = snapshot.data();
        setHunter({
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

  const isOffline = hunter !== null && now / 1000 - hunter.timestamp > OFFLINE_THRESHOLD_SECONDS;

  return { hunter, error, isOffline };
}
