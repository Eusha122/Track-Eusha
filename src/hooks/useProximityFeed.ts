import { useCallback, useEffect, useRef, useState } from 'react';

export interface FeedEntry {
  id: number;
  time: string;
  text: string;
}

function formatTime(date: Date) {
  return date.toTimeString().slice(0, 8);
}

const PROXIMITY_TIERS = [
  { threshold: 200, message: 'Target detected nearby.' },
  { threshold: 100, message: 'Signal strength increasing.' },
  { threshold: 50, message: 'Visual contact may be possible.' },
  { threshold: 20, message: 'Target extremely close.' },
  { threshold: 10, message: 'Target located.' },
];

function getTierIndex(distance: number): number {
  for (let i = PROXIMITY_TIERS.length - 1; i >= 0; i -= 1) {
    if (distance < PROXIMITY_TIERS[i].threshold) return i;
  }
  return -1;
}

interface ProximityFeedInput {
  distance: number | null;
  signalAcquired: boolean;
  isOffline: boolean;
}

export function useProximityFeed({ distance, signalAcquired, isOffline }: ProximityFeedInput) {
  const [entries, setEntries] = useState<FeedEntry[]>([]);
  const idRef = useRef(0);
  const bestTierRef = useRef(-1);
  const signalSeenRef = useRef(false);
  const wasOfflineRef = useRef(false);

  const pushEntry = useCallback((text: string) => {
    setEntries((current) =>
      [...current, { id: idRef.current++, time: formatTime(new Date()), text }].slice(-6),
    );
  }, []);

  useEffect(() => {
    if (signalAcquired && !signalSeenRef.current) {
      signalSeenRef.current = true;
      pushEntry('Tracking system online.');
    }
  }, [signalAcquired, pushEntry]);

  useEffect(() => {
    if (distance === null) return;
    const tierIndex = getTierIndex(distance);
    if (tierIndex > bestTierRef.current) {
      // Push every tier crossed in this jump, not just the deepest one, in
      // case a sparse GPS update skips straight past one or more tiers.
      for (let i = bestTierRef.current + 1; i <= tierIndex; i += 1) {
        pushEntry(PROXIMITY_TIERS[i].message);
      }
      bestTierRef.current = tierIndex;
    }
  }, [distance, pushEntry]);

  useEffect(() => {
    if (isOffline && !wasOfflineRef.current) {
      pushEntry('Unable to contact target.');
    }
    wasOfflineRef.current = isOffline;
  }, [isOffline, pushEntry]);

  return entries;
}
