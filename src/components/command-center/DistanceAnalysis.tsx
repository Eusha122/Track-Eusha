import { motion } from 'framer-motion';
import { EASE_CINEMATIC } from '../../lib/motion';
import { GLASS_PANEL } from './glassStyles';

// Rough walking pace in meters per minute, used only to derive a mock ETA.
const WALKING_PACE_M_PER_MIN = 80;

export function DistanceAnalysis({ meters }: { meters: number | null }) {
  const isHere = meters !== null && meters === 0;
  const etaMinutes = meters === null || isHere ? null : Math.max(1, Math.round(meters / WALKING_PACE_M_PER_MIN));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: EASE_CINEMATIC }}
      className={`flex w-full flex-col items-center gap-2 ${GLASS_PANEL}`}
    >
      <span className={`text-6xl font-bold tracking-tight ${isHere ? 'text-emerald-500' : 'text-indigo-600'}`}>
        {meters === null ? '—' : isHere ? '0m' : `${meters}m`}
      </span>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
        {isHere ? 'Target Located' : 'Target Distance'}
      </p>
      {!isHere && (
        <p className="mt-2 text-sm text-slate-500">
          Estimated Arrival:{' '}
          <span className="font-semibold text-slate-700">
            {etaMinutes === null
              ? 'Awaiting signal'
              : `${etaMinutes} minute${etaMinutes === 1 ? '' : 's'}`}
          </span>
        </p>
      )}
      {isHere && (
        <p className="mt-2 text-sm font-semibold text-emerald-600">
          ✓ You're at the target location
        </p>
      )}
    </motion.div>
  );
}
