import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { screenTransition, screenVariants } from '../../lib/motion';
import { CLAY_RAISED } from './glassStyles';

const PROXIMITY_THRESHOLD = 120; // meters

/**
 * Full-screen proximity alert that plays a buzzer sound when the user
 * is within 120 m of the target. Shows a dismiss button to silence it.
 * On mobile, autoplay is blocked — a "Tap to activate" prompt is shown.
 */
export function ProximityAlert({
  distance,
  onDismiss,
}: {
  distance: number | null;
  onDismiss: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [pulsing, setPulsing] = useState(true);
  const [soundPlaying, setSoundPlaying] = useState(false);

  // Create audio element on mount
  useEffect(() => {
    const audio = new Audio('/buzzer.mp3');
    audio.loop = true;
    audio.volume = 1;
    audioRef.current = audio;

    // Try autoplay — works on desktop, blocked on mobile
    audio
      .play()
      .then(() => setSoundPlaying(true))
      .catch(() => {
        // Autoplay blocked — user will need to tap
        setSoundPlaying(false);
      });

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

  // Pulse animation toggle
  useEffect(() => {
    const id = setInterval(() => setPulsing((p) => !p), 600);
    return () => clearInterval(id);
  }, []);

  const handleActivateSound = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => setSoundPlaying(true)).catch(() => {});
    }
  };

  const handleDismiss = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onDismiss();
  };

  return (
    <motion.div
      initial={screenVariants.initial}
      animate={screenVariants.animate}
      exit={screenVariants.exit}
      transition={screenTransition}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-gradient-to-br from-red-50 via-white to-orange-50 px-6 text-center"
    >
      {/* Pulsing radar rings */}
      <div className="relative flex h-44 w-44 items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border-2 border-red-400/60"
            initial={{ scale: 0.3, opacity: 0.9 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: 'easeOut',
              delay: i * 0.4,
            }}
          />
        ))}

        {/* Center icon */}
        <motion.div
          animate={{ scale: pulsing ? 1.08 : 1 }}
          transition={{ duration: 0.3 }}
          className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-red-500 ${CLAY_RAISED}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="h-12 w-12"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z" />
          </svg>
        </motion.div>
      </div>

      {/* Alert text */}
      <div className="flex flex-col items-center gap-2">
        <motion.h2
          animate={{ opacity: pulsing ? 1 : 0.6 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-extrabold tracking-tight text-red-600 sm:text-4xl"
        >
          ⚠️ PROXIMITY ALERT
        </motion.h2>
        <p className="text-base font-medium uppercase tracking-[0.2em] text-red-500/80">
          You are near Eusha
        </p>
        {distance !== null && (
          <p className="mt-1 text-5xl font-black tabular-nums text-red-600">
            {distance}
            <span className="text-2xl font-bold">m</span>
          </p>
        )}
        <p className="mt-1 text-sm text-slate-500">
          Within {PROXIMITY_THRESHOLD}m range
        </p>
      </div>

      {/* Tap to activate sound — shown when autoplay is blocked on mobile */}
      {!soundPlaying && (
        <motion.button
          onClick={handleActivateSound}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileTap={{ scale: 0.96 }}
          className={`rounded-full bg-orange-500 px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-lg shadow-orange-500/30 ${CLAY_RAISED}`}
        >
          🔊 Tap to Activate Buzzer
        </motion.button>
      )}

      {/* Dismiss button */}
      <motion.button
        onClick={handleDismiss}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        className={`rounded-full bg-red-600 px-10 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-lg shadow-red-500/30 ${CLAY_RAISED}`}
      >
        🔇 Silence &amp; Dismiss
      </motion.button>
    </motion.div>
  );
}
