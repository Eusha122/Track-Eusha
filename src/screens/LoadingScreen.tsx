import { AnimatePresence, motion } from 'framer-motion';
import { useBootSequence } from '../hooks/useBootSequence';
import { GradientBackdrop } from '../components/ui/GradientBackdrop';
import { screenTransition, screenVariants } from '../lib/motion';

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const { progress, label, tip } = useBootSequence(onComplete);

  return (
    <motion.main
      initial={screenVariants.initial}
      animate={screenVariants.animate}
      exit={screenVariants.exit}
      transition={screenTransition}
      className="fixed inset-0 overflow-hidden bg-slate-50 flex flex-col items-center justify-center font-sans selection:bg-indigo-500/30"
    >
      <GradientBackdrop />

      {/* Tech Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1.5' cy='1.5' r='1.5' fill='%236366f1'/%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px',
          maskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)'
        }}
      />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center justify-center gap-14 px-6">
        
        {/* Radar / Central Animated Asset */}
        <div className="relative flex h-56 w-56 items-center justify-center">
          {/* Outer dashed ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed border-indigo-400/40"
          />
          {/* Inner ring spinning opposite */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-6 rounded-full border-[1.5px] border-sky-400/20 border-t-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
          />
          {/* Center glowing node */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute h-20 w-20 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 blur-md opacity-60"
          />
          {/* Core glass circle */}
          <div className="absolute h-16 w-16 rounded-full bg-white/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_10px_rgba(99,102,241,0.2)] backdrop-blur-md flex items-center justify-center">
            <span className="font-serif text-3xl italic font-semibold text-indigo-600 tracking-tighter">E</span>
          </div>

          {/* Sweeping Radar Line */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-6 origin-center rounded-full"
          >
            <div className="h-1/2 w-[1.5px] bg-gradient-to-t from-transparent to-indigo-500 mx-auto opacity-70" />
          </motion.div>
        </div>

        <div className="flex w-full flex-col items-center gap-8">
          
          {/* Brand header */}
          <div className="flex flex-col items-center gap-2">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-3xl font-bold tracking-tight text-slate-800"
            >
              Eusha Locator
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="rounded-full bg-white/70 px-3 py-1 border border-white shadow-sm backdrop-blur-md"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500">
                System Initializing
              </p>
            </motion.div>
          </div>

          <div className="w-full space-y-5">
            {/* Glassmorphic Progress Card */}
            <div className="relative overflow-hidden rounded-2xl bg-white/40 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-xl border border-white/60">
              <div className="mb-4 flex items-end justify-between">
                <div className="relative h-5 flex-1">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={label}
                      initial={{ opacity: 0, y: 8, filter: 'blur(2px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
                      transition={{ duration: 0.3 }}
                      className="absolute bottom-0 left-0 text-[11px] font-bold uppercase tracking-wider text-slate-700"
                    >
                      {label}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <div className="text-sm font-mono font-bold text-indigo-600">
                  {progress}%
                </div>
              </div>
              
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-200/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-indigo-500 relative"
                  style={{ 
                    width: `${progress}%`,
                    backgroundSize: '200% 100%'
                  }}
                  animate={{ backgroundPosition: ['100% 0', '-100% 0'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-r from-transparent to-white/60" />
                </motion.div>
              </div>
            </div>

            {/* Premium Tip Container */}
            <div className="relative overflow-hidden rounded-2xl bg-white/30 p-5 shadow-sm backdrop-blur-md border border-white/40 min-h-[5.5rem] flex items-center justify-center text-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={tip}
                  initial={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.04, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4 }}
                  className="text-[13px] text-slate-600 font-medium leading-relaxed"
                >
                  {tip}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </motion.main>
  );
}
