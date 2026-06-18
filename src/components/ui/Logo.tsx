import { motion } from 'framer-motion';
import { EASE_CINEMATIC } from '../../lib/motion';

export function Logo({ size = 'lg' }: { size?: 'lg' | 'sm' }) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE_CINEMATIC }}
      className={
        size === 'lg'
          ? 'text-4xl font-semibold tracking-tight text-slate-800 sm:text-5xl'
          : 'text-lg font-semibold tracking-tight text-slate-800'
      }
    >
      Eusha Locator
    </motion.h1>
  );
}
