export const SCREENS = [
  'loading',
  'landing',
  'tutorial-1',
  'tutorial-2',
  'tutorial-3',
  'briefing',
  'command-center',
] as const;

export type ScreenId = (typeof SCREENS)[number];

export function nextScreen(current: ScreenId): ScreenId {
  const index = SCREENS.indexOf(current);
  return SCREENS[Math.min(index + 1, SCREENS.length - 1)];
}
