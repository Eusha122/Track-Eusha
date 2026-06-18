import { AnimatePresence, motion } from 'framer-motion';
import { useProximityFeed } from '../../hooks/useProximityFeed';
import { EASE_CINEMATIC } from '../../lib/motion';
import { GLASS_PANEL } from './glassStyles';

interface MissionFeedProps {
  distance: number | null;
  signalAcquired: boolean;
  isOffline: boolean;
}

export function MissionFeed({ distance, signalAcquired, isOffline }: MissionFeedProps) {
  const entries = useProximityFeed({ distance, signalAcquired, isOffline });

  return (
    <div className="flex w-full flex-col gap-4 text-left">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
        Mission Intelligence Feed
      </p>
      <div className={`flex flex-col gap-2.5 font-mono text-xs ${GLASS_PANEL}`}>
        <AnimatePresence initial={false}>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE_CINEMATIC }}
              className="flex gap-3"
            >
              <span className="text-slate-400">[{entry.time}]</span>
              <span className="text-slate-700">{entry.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
