import { useEffect, useRef, useState } from 'react';

const STATUS_STEPS = [
  { at: 0, label: 'Initializing Mission Systems...' },
  { at: 15, label: 'Loading Topographical Maps...' },
  { at: 30, label: 'Calibrating Sensors...' },
  { at: 50, label: 'Bypassing Firewalls...' },
  { at: 70, label: 'Establishing Satellite Link...' },
  { at: 85, label: 'Decrypting Coordinates...' },
  { at: 95, label: 'Ready.' },
];

const TIPS = [
  "TIP: You can find Eusha by tracking recent movements on the grid.",
  "TIP: If the signal drops, wait for the satellite to reposition.",
  "TIP: Use the Command Center to analyze intercepted data.",
  "TIP: Stay undetected. The targets are constantly moving."
];

const DURATION_MS = 6000;

export function useBootSequence(onComplete: () => void) {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 2500);

    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    const start = Date.now();
    let frame: number;

    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / DURATION_MS) * 100));
      setProgress(pct);
      if (pct < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          onCompleteRef.current();
        }, 400); // Small delay at 100% before transition
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const label =
    [...STATUS_STEPS].reverse().find((step) => progress >= step.at)?.label ??
    STATUS_STEPS[0].label;

  return { progress, label, tip: TIPS[tipIndex] };
}
