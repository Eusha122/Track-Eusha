import type { ReactNode } from 'react';

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/35">{children}</p>
  );
}
