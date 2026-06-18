import { motion } from 'framer-motion';
import { ACHIEVEMENT_DEFINITIONS } from '../../lib/mockData';
import { EASE_CINEMATIC } from '../../lib/motion';
import { CLAY_PRESSED, CLAY_RAISED } from './glassStyles';

interface AchievementsPanelProps {
  signalAcquired: boolean;
  distance: number | null;
}

export function AchievementsPanel({ signalAcquired, distance }: AchievementsPanelProps) {
  const effectiveDistance = distance ?? Infinity;
  const unlockedMap: Record<string, boolean> = {
    'first-contact': true,
    'signal-acquired': signalAcquired,
    'within-100m': effectiveDistance < 100,
    'target-found': effectiveDistance < 10,
  };

  return (
    <div className="flex w-full flex-col gap-5 text-left">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
        Achievement System
      </p>
      <div className="grid grid-cols-2 gap-4">
        {ACHIEVEMENT_DEFINITIONS.map((achievement, i) => {
          const unlocked = unlockedMap[achievement.id];
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE_CINEMATIC }}
              className={`flex flex-col gap-1.5 rounded-2xl border p-4 transition-all duration-700 ${
                unlocked
                  ? `border-white/80 bg-white/70 ${CLAY_RAISED}`
                  : `border-slate-200/60 bg-slate-100/50 ${CLAY_PRESSED}`
              }`}
            >
              <span
                className={`text-sm font-semibold transition-colors duration-700 ${
                  unlocked ? 'text-indigo-600' : 'text-slate-400'
                }`}
              >
                {achievement.title}
              </span>
              <span
                className={`text-xs transition-colors duration-700 ${
                  unlocked ? 'text-slate-500' : 'text-slate-400/70'
                }`}
              >
                {unlocked ? achievement.description : 'Locked'}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
