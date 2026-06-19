import { useMemo, useState } from 'react';
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

// GPS dead zone: distances below this are indistinguishable from 0
// due to hardware limitations (~5-15m accuracy on phones).
const GPS_DEAD_ZONE_M = 5;

// Hysteresis thresholds to prevent stage flickering.
const FOUND_ENTER = 15;
const FOUND_EXIT = 35;
const APPROACH_ENTER = 100;
const APPROACH_EXIT = 130;

export function useMissionTracking(): MissionTracking {
  const { position: userPosition, error: userError, ready: signalAcquired } = useUserLocation();
  const { target, error: targetError, isOffline } = useTargetLocation();

  const [committedStage, setCommittedStage] = useState<MissionStage>('mission-started');

  const rawDistance = useMemo(() => {
    if (!userPosition || !target) return null;
    return calculateDistanceMeters(userPosition, target);
  }, [userPosition, target]);

  // Apply dead zone: anything under GPS_DEAD_ZONE_M becomes 0
  const distance = useMemo(() => {
    if (rawDistance === null) return null;
    if (rawDistance < GPS_DEAD_ZONE_M) return 0;
    return Math.round(rawDistance);
  }, [rawDistance]);

  const bearing = useMemo(() => {
    if (!userPosition || !target) return null;
    return calculateBearingDegrees(userPosition, target);
  }, [userPosition, target]);

  const targetLocated = target !== null;

  let stage: MissionStage;
  if (!signalAcquired) {
    stage = 'mission-started';
  } else if (!targetLocated) {
    stage = 'signal-acquired';
  } else if (rawDistance === null) {
    stage = 'target-located';
  } else if (committedStage === 'target-found') {
    stage = rawDistance > FOUND_EXIT ? 'approaching-target' : 'target-found';
  } else if (committedStage === 'approaching-target') {
    if (rawDistance <= FOUND_ENTER) {
      stage = 'target-found';
    } else if (rawDistance > APPROACH_EXIT) {
      stage = 'target-located';
    } else {
      stage = 'approaching-target';
    }
  } else if (rawDistance <= FOUND_ENTER) {
    stage = 'target-found';
  } else if (rawDistance <= APPROACH_ENTER) {
    stage = 'approaching-target';
  } else {
    stage = 'target-located';
  }

  if (stage !== committedStage) {
    setCommittedStage(stage);
  }

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
