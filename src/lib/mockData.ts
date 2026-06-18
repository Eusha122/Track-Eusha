export const TARGET_PROFILE = [
  { label: 'Target Name', value: 'Eusha' },
  { label: 'Threat Level', value: 'Unknown' },
  { label: 'Last Known Status', value: 'Active' },
  { label: 'Capture Probability', value: '87%' },
  { label: 'Favorite Activity', value: 'Remaining difficult to locate' },
] as const;

export const ACHIEVEMENT_DEFINITIONS = [
  { id: 'first-contact', title: 'First Contact', description: 'Tracking application opened.' },
  { id: 'signal-acquired', title: 'Signal Acquired', description: 'GPS signal locked.' },
  { id: 'within-100m', title: 'Within 100m', description: 'Closing in on the target.' },
  { id: 'target-found', title: 'Target Found', description: 'Target successfully located.' },
] as const;
