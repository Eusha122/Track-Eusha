import { motion } from 'framer-motion';
import { useDeviceHeading } from '../../hooks/useDeviceHeading';
import { CLAY_RAISED } from './glassStyles';

const RING_INSETS = [0, 16];

export function RadarSystem({ bearing }: { bearing: number | null }) {
  const { heading, permission, requestPermission } = useDeviceHeading();

  const relativeBearing =
    bearing !== null && heading !== null ? (bearing - heading + 360) % 360 : bearing;

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
        Live Target Radar
      </p>

      {permission === 'unknown' && (
        <button
          onClick={requestPermission}
          className="rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-xs font-medium text-indigo-500"
        >
          Enable Compass
        </button>
      )}

      <div
        className={`relative flex h-64 w-64 items-center justify-center rounded-full border border-white/80 bg-white/50 backdrop-blur-xl sm:h-72 sm:w-72 ${CLAY_RAISED}`}
      >
        {RING_INSETS.map((inset) => (
          <span
            key={inset}
            className="absolute rounded-full border border-slate-300/60"
            style={{ inset: `${inset}%` }}
          />
        ))}

        {relativeBearing !== null && (
          <motion.div
            className="absolute rounded-full bg-red-500 shadow-[0_0_14px_4px_rgba(239,68,68,0.55)]"
            style={{
              left: '50%',
              top: '50%',
              width: '4px',
              height: '46%',
              marginLeft: '-2px',
              transformOrigin: 'top',
            }}
            animate={{ rotate: relativeBearing }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        )}

        <div
          className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-white/80 bg-white/80 ${CLAY_RAISED}`}
        >
          <span className="text-xl font-bold tracking-tight text-indigo-600">E</span>
        </div>
      </div>

      {relativeBearing === null && (
        <p className="text-xs text-slate-400">Waiting for GPS position…</p>
      )}
    </div>
  );
}
