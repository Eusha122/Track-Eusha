import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE_CINEMATIC } from '../../lib/motion';

export function ScreenHeading({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay, ease: EASE_CINEMATIC }}
        className="rounded-full bg-indigo-100 px-3 py-1 border border-indigo-200"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">
          Transmission Intercepted
        </span>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: delay + 0.1, ease: EASE_CINEMATIC }}
        className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800 text-center"
      >
        {children}
      </motion.h2>
    </div>
  );
}
