import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';
import { ScreenShell } from '../components/ui/ScreenShell';
import { EASE_CINEMATIC } from '../lib/motion';

export function LandingScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <ScreenShell>
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center justify-center gap-12 px-2">
        {/* Animated glowing orb/avatar for the "game" feel */}
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative flex h-32 w-32 items-center justify-center"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-400 to-sky-300 blur-xl opacity-50" />
          <div className="relative h-20 w-20 rounded-full bg-white shadow-[0_4px_20px_rgba(99,102,241,0.4)] border-2 border-white flex items-center justify-center backdrop-blur-md">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-sky-400 shadow-inner" />
          </div>
        </motion.div>

        <div className="flex flex-col items-center gap-6 w-full text-center">
          <Logo />
          <div className="rounded-2xl bg-white/60 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.03)] backdrop-blur-xl border border-white/80 w-full relative overflow-hidden">
            <motion.div 
              className="absolute left-0 top-0 h-full w-[3px] bg-indigo-500"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE_CINEMATIC }}
              className="font-medium text-slate-600 leading-relaxed text-[13px] italic"
            >
              "Find him if you can."
            </motion.p>
          </div>
        </div>

        <div className="mt-2 w-full">
          <Button delay={0.6} onClick={onBegin} className="w-full">
            Start Mission
          </Button>
        </div>
      </div>
    </ScreenShell>
  );
}
