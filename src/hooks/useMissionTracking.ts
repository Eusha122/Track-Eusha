import { useMemo, useRef } from 'react';
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

// Hysteresis thresholds to prevent stage flickering from GPS jitter.
// Enter "target-found" at ≤ FOUND_ENTER, leave at > FOUND_EXIT.
// Enter "approaching-target" at ≤ APPROACH_ENTER, leave at > APPROACH_EXIT.
const FOUND_ENTER = 15;
const FOUND_EXIT = 30;
const APPROACH_ENTER = 100;
const APPROACH_EXIT = 130;

export function useMissionTracking(): MissionTracking {
  const { position: userPosition, error: userError, ready: signalAcquired } = useUserLocation();
  const { target, error: targetError, isOffline } = useTargetLocation();

  // Keep a ref of the previous stage to apply hysteresis
  const prevStageRef = useRef<MissionStage>('mission-started');

  const distance = useMemo(() => {
    if (!userPosition || !target) return null;
    return Math.round(calculateDistanceMeters(userPosition, target));
  }, [userPosition, target]);

  const bearing = useMemo(() => {
    if (!userPosition || !target) return null;
    return calculateBearingDegrees(userPosition, target);
  }, [userPosition, target]);

  const targetLocated = target !== null;

  // Apply hysteresis-based stage transitions to prevent jitter-driven flickering
  let stage: MissionStage;
  if (!signalAcquired) {
    stage = 'mission-started';
  } else if (!targetLocated) {
    stage = 'signal-acquired';
  } else if (distance === null) {
    stage = 'target-located';
  } else {
    const prev = prevStageRef.current;

    if (prev === 'target-found') {
      // Stay in "found" until distance exceeds exit threshold
      stage = distance > FOUND_EXIT ? 'approaching-target' : 'target-found';
    } else if (prev === 'approaching-target') {
      if (distance <= FOUND_ENTER) {
        stage = 'target-found';
      } else if (distance > APPROACH_EXIT) {
        stage = 'target-located';
      } else {
        stage = 'approaching-target';
      }
    } else {
      // From 'target-located' or other states
      if (distance <= FOUND_ENTER) {
        stage = 'target-found';
      } else if (distance <= APPROACH_ENTER) {
        stage = 'approaching-target';
      } else {
        stage = 'target-located';
      }
    }
  }

  prevStageRef.current = stage;

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
