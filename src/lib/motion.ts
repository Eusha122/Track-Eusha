export const EASE_CINEMATIC = [0.16, 1, 0.3, 1] as const;

export const screenVariants = {
  initial: { opacity: 0, y: 28, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -18, scale: 0.99 },
};

export const screenTransition = {
  duration: 0.9,
  ease: EASE_CINEMATIC,
};
