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
      className={`fixed inset-0 z-10 flex flex-col bg-slate-50 ${
        align === 'center'
          ? 'items-center justify-center px-6 py-16 sm:px-10'
          : 'items-center overflow-y-auto px-6 py-12 sm:px-10'
      }`}
    >
      {/* Tech Grid Overlay for Game Aesthetic */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1.5' cy='1.5' r='1.5' fill='%236366f1'/%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px',
          maskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)'
        }}
      />
      <div className={`relative z-10 w-full ${maxWidthClassName}`}>{children}</div>
    </motion.main>
  );
}
