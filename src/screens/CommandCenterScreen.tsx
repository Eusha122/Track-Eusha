import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { TargetProfile } from '../components/command-center/TargetProfile';
import { RadarSystem } from '../components/command-center/RadarSystem';
import { DistanceAnalysis } from '../components/command-center/DistanceAnalysis';
import { MissionFeed } from '../components/command-center/MissionFeed';
import { ArrivalSequence } from '../components/command-center/ArrivalSequence';
import { ProximityAlert } from '../components/command-center/ProximityAlert';
import { GradientBackdrop } from '../components/ui/GradientBackdrop';
import { useMissionTracking } from '../hooks/useMissionTracking';
import { screenTransition, screenVariants } from '../lib/motion';

export function CommandCenterScreen() {
  const mission = useMissionTracking();
  const [dismissedArrival, setDismissedArrival] = useState(false);
  const [proximityTriggered, setProximityTriggered] = useState(false);
  const [proximityDismissed, setProximityDismissed] = useState(false);
  const [trackedStage, setTrackedStage] = useState(mission.stage);

  if (mission.stage !== trackedStage) {
    setTrackedStage(mission.stage);
    if (mission.stage !== 'target-found') setDismissedArrival(false);
  }

  const showArrival = mission.stage === 'target-found' && !dismissedArrival;

  // Proximity alert: latch on when within 120m, stays until manually closed
  const PROXIMITY_THRESHOLD = 120;
  const isInRange =
    mission.distance !== null && mission.distance <= PROXIMITY_THRESHOLD;

  // Reset dismissed flag once user leaves the range, so it can re-trigger next time
  if (!isInRange && proximityDismissed) {
    setProximityDismissed(false);
    setProximityTriggered(false);
  }

  // Trigger alert when in range and not already dismissed
  if (isInRange && !proximityTriggered && !proximityDismissed) {
    setProximityTriggered(true);
  }

  const showProximity = proximityTriggered && !proximityDismissed && !showArrival;

  return (
    <>
      <motion.main
        initial={screenVariants.initial}
        animate={screenVariants.animate}
        exit={screenVariants.exit}
        transition={screenTransition}
        className="fixed inset-0 overflow-y-auto bg-slate-50"
      >
        <GradientBackdrop />

        <div className="relative flex flex-col items-center gap-6 px-6 py-8 pb-12 sm:px-10">
          <div className="flex flex-col items-center gap-0.5 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-indigo-500/70">
              Operation: Find Eusha — Live
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
              Command Center
            </h2>
          </div>

          <div className="flex w-full max-w-md flex-col items-center gap-6">
            <TargetProfile status={mission.targetStatus} />
            <RadarSystem bearing={mission.bearing} />
            <DistanceAnalysis meters={mission.distance} />
            <MissionFeed
              distance={mission.distance}
              signalAcquired={mission.signalAcquired}
              isOffline={mission.isOffline}
            />

            {(mission.userError || mission.targetError) && (
              <div className="w-full rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-left text-xs text-rose-600 backdrop-blur">
                {mission.userError && <p>Location error: {mission.userError}</p>}
                {mission.targetError && <p>Sync error: {mission.targetError}</p>}
              </div>
            )}
          </div>
        </div>
      </motion.main>

      <AnimatePresence>
        {showArrival && (
          <ArrivalSequence key="arrival" onDismiss={() => setDismissedArrival(true)} />
        )}
        {showProximity && (
          <ProximityAlert
            key="proximity"
            distance={mission.distance}
            onDismiss={() => setProximityDismissed(true)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
