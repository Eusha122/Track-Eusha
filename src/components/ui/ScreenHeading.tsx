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
    <motion.h2
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE_CINEMATIC }}
      className="text-3xl font-semibold tracking-tight text-white sm:text-4xl"
    >
      {children}
    </motion.h2>
  );
}
