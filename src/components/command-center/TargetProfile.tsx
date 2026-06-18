import { motion } from 'framer-motion';
import { TARGET_PROFILE } from '../../lib/mockData';
import { EASE_CINEMATIC } from '../../lib/motion';
import { GLASS_PANEL } from './glassStyles';

export function TargetProfile({ status = 'Active' }: { status?: string }) {
  const rows = TARGET_PROFILE.map((row) =>
    row.label === 'Last Known Status' ? { ...row, value: status } : row,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: EASE_CINEMATIC }}
      className={`w-full text-left ${GLASS_PANEL}`}
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
        Target Profile
      </p>
      <div className="mt-4 flex flex-col gap-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-4 border-b border-slate-200/70 pb-3 last:border-none last:pb-0"
          >
            <span className="text-xs uppercase tracking-wide text-slate-400">{row.label}</span>
            <span
              className={`text-right text-sm font-semibold ${
                row.label === 'Last Known Status' && status === 'Signal Lost'
                  ? 'text-rose-500'
                  : 'text-slate-700'
              }`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
