import { useMemo } from 'react';
import { useUserLocation } from './useUserLocation';
import { useTargetLocation } from './useTargetLocation';
import { calculateBearingDegrees, calculateDistanceMeters } from '../lib/geo';

export type MissionStage =
  | 'mission-started'
  | 'signal-acquired'
  | 'target-located'
  | 'approaching-target'
  | 'target-found';

export interface MissionTracking {
  distance: number | null;
  bearing: number | null;
  signalAcquired: boolean;
  stage: MissionStage;
  isOffline: boolean;
  targetStatus: string;
  userError: string | null;
  targetError: string | null;
}

export function useMissionTracking(): MissionTracking {
  const { position: userPosition, error: userError, ready: signalAcquired } = useUserLocation();
  const { target, error: targetError, isOffline } = useTargetLocation();

  const distance = useMemo(() => {
    if (!userPosition || !target) return null;
    return Math.round(calculateDistanceMeters(userPosition, target));
  }, [userPosition, target]);

  const bearing = useMemo(() => {
    if (!userPosition || !target) return null;
    return calculateBearingDegrees(userPosition, target);
  }, [userPosition, target]);

  const targetLocated = target !== null;

  const stage: MissionStage = !signalAcquired
    ? 'mission-started'
    : !targetLocated
      ? 'signal-acquired'
      : distance !== null && distance < 10
        ? 'target-found'
        : distance !== null && distance < 100
          ? 'approaching-target'
          : 'target-located';

  const targetStatus = isOffline ? 'Signal Lost' : target ? 'Active' : 'Unknown';

  return {
    distance,
    bearing,
    signalAcquired,
    stage,
    isOffline,
    targetStatus,
    userError,
    targetError,
  };
}
