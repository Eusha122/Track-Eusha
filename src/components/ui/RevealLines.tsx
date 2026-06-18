import { motion } from 'framer-motion';
import { EASE_CINEMATIC } from '../../lib/motion';

export interface RevealLine {
  text: string;
  delay: number;
  className?: string;
}

export function RevealLines({ lines }: { lines: RevealLine[] }) {
  return (
    <div className="flex flex-col gap-4">
      {lines.map((line) => (
        <motion.p
          key={line.text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: line.delay, ease: EASE_CINEMATIC }}
          className={line.className ?? 'text-base leading-relaxed text-white/60'}
        >
          {line.text}
        </motion.p>
      ))}
    </div>
  );
}
