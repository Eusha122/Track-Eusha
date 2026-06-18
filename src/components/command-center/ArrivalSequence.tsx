import { motion } from 'framer-motion';
import { screenTransition, screenVariants } from '../../lib/motion';
import { CLAY_RAISED } from './glassStyles';

const BURST_RINGS = [0, 1, 2];

export function ArrivalSequence({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={screenVariants.initial}
      animate={screenVariants.animate}
      exit={screenVariants.exit}
      transition={screenTransition}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-gradient-to-br from-sky-100 via-white to-indigo-100 px-6 text-center"
    >
      <div className="relative flex h-40 w-40 items-center justify-center">
        {BURST_RINGS.map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border-2 border-indigo-300/70"
            initial={{ scale: 0.3, opacity: 0.8 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: i * 0.5 }}
          />
        ))}
        <div
          className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-white/90 ${CLAY_RAISED}`}
        >
          <span className="text-3xl font-bold tracking-tight text-indigo-600">E</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
          TARGET FOUND
        </h2>
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">Mission Success</p>
      </div>

      <motion.button
        onClick={onDismiss}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        className={`rounded-full bg-indigo-600 px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white ${CLAY_RAISED}`}
      >
        Return to Command Center
      </motion.button>
    </motion.div>
  );
}
