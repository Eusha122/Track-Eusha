import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes } from 'react';
import { EASE_CINEMATIC } from '../../lib/motion';

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd'
>;

interface ButtonProps extends NativeButtonProps {
  delay?: number;
}

export function Button({ children, delay = 0, className = '', ...props }: ButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: EASE_CINEMATIC }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className={`inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-4 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-indigo-500 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
