import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { RevealLines } from '../ui/RevealLines';
import { ScreenHeading } from '../ui/ScreenHeading';
import { EASE_CINEMATIC } from '../../lib/motion';

export function MissionBriefing({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto">
      <div className="flex flex-col items-center gap-4 w-full">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_CINEMATIC }}
          className="rounded-full bg-rose-100 border border-rose-200 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-rose-600 shadow-sm"
        >
          Classification: Confidential
        </motion.span>
        <ScreenHeading delay={0.15}>Operation: Find Eusha</ScreenHeading>
      </div>

      <div className="w-full mt-4">
        <RevealLines
          lines={[
            {
              text: 'Recent intelligence suggests the target known as Eusha is somewhere nearby.',
              delay: 0.55,
            },
            {
              text: 'Despite multiple failed attempts by the public, successful location of the target may now be possible.',
              delay: 1.5,
            },
            {
              text: 'Proceed with caution.',
              delay: 2.8,
              className: 'text-sm font-bold text-indigo-600 uppercase tracking-wide mt-2 block',
            },
          ]}
        />
      </div>

      <div className="w-full mt-4">
        <Button delay={3.6} onClick={onBegin} className="w-full uppercase tracking-widest text-xs font-bold">
          Begin Operation
        </Button>
      </div>
    </div>
  );
}
