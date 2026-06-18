import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { screenTransition, screenVariants } from '../../lib/motion';

interface ScreenShellProps {
  children: ReactNode;
  align?: 'center' | 'top';
  maxWidthClassName?: string;
}

export function ScreenShell({
  children,
  align = 'center',
  maxWidthClassName = 'max-w-sm',
}: ScreenShellProps) {
  return (
    <motion.main
      initial={screenVariants.initial}
      animate={screenVariants.animate}
      exit={screenVariants.exit}
      transition={screenTransition}
      className={
        align === 'center'
          ? 'fixed inset-0 z-10 flex flex-col items-center justify-center px-6 py-16 sm:px-10'
          : 'fixed inset-0 z-10 flex flex-col items-center overflow-y-auto px-6 py-12 sm:px-10'
      }
    >
      <div className={`w-full ${maxWidthClassName}`}>{children}</div>
    </motion.main>
  );
}
