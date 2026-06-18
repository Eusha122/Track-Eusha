import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { RevealLines } from '../ui/RevealLines';
import { ScreenHeading } from '../ui/ScreenHeading';
import { EASE_CINEMATIC } from '../../lib/motion';

export function MissionBriefing({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="flex flex-col items-center gap-10 text-center">
      <div className="flex flex-col items-center gap-4">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_CINEMATIC }}
          className="rounded-full border border-white/20 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.3em] text-white/50"
        >
          Classification: Confidential
        </motion.span>
        <ScreenHeading delay={0.15}>OPERATION: FIND EUSHA</ScreenHeading>
      </div>

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
            delay: 2.5,
            className: 'text-base font-medium text-white',
          },
        ]}
      />

      <Button delay={3.3} onClick={onBegin} className="uppercase tracking-[0.15em]">
        Begin Operation
      </Button>
    </div>
  );
}
