import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';
import { ScreenShell } from '../components/ui/ScreenShell';
import { EASE_CINEMATIC } from '../lib/motion';

export function LandingScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <ScreenShell>
      <div className="flex flex-col items-center gap-6 text-center">
        <Logo />
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: EASE_CINEMATIC }}
          className="font-serif text-lg italic text-slate-500"
        >
          Find him if you can.
        </motion.p>
        <div className="mt-10">
          <Button delay={0.55} onClick={onBegin}>
            Begin Search
          </Button>
        </div>
      </div>
    </ScreenShell>
  );
}
