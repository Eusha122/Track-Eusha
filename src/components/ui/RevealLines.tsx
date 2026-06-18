import { motion } from 'framer-motion';
import { EASE_CINEMATIC } from '../../lib/motion';

export interface RevealLine {
  text: string;
  delay: number;
  className?: string;
}

export function RevealLines({ lines }: { lines: RevealLine[] }) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {lines.map((line, i) => (
        <motion.div
          key={line.text}
          initial={{ opacity: 0, x: -10, filter: 'blur(2px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, delay: line.delay, ease: EASE_CINEMATIC }}
          className="relative rounded-xl bg-white/70 p-4 shadow-sm backdrop-blur-md border border-white flex items-start gap-3 w-full"
        >
          {/* Avatar / Icon for dialog */}
          <div className="flex-shrink-0 h-6 w-6 mt-0.5 rounded-full bg-indigo-100 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          </div>
          <p className={line.className ?? 'text-[13px] font-medium text-slate-700 leading-relaxed text-left'}>
            {line.text}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
