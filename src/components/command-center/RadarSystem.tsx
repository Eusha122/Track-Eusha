import { motion } from 'framer-motion';
import { useDeviceHeading } from '../../hooks/useDeviceHeading';
import { CLAY_RAISED } from './glassStyles';

const RING_INSETS = [0, 16];

/* ── Tick-mark geometry ─────────────────────────────────────── */
const TICK_COUNT = 72; // every 5°
const RADIUS_RATIO = 0.46; // fraction of container (tick outer edge)
const CARDINAL_DIRS = [
  { label: 'N', deg: 0, color: '#ef4444', bold: true },
  { label: 'E', deg: 90, color: '#94a3b8', bold: false },
  { label: 'S', deg: 180, color: '#94a3b8', bold: false },
  { label: 'W', deg: 270, color: '#94a3b8', bold: false },
];

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
        {/* Concentric rings */}
        {RING_INSETS.map((inset) => (
          <span
            key={inset}
            className="absolute rounded-full border border-slate-300/60"
            style={{ inset: `${inset}%` }}
          />
        ))}

        {/* Tick marks — positioned with transform from exact center */}
        {Array.from({ length: TICK_COUNT }).map((_, i) => {
          const deg = i * (360 / TICK_COUNT);
          const isCardinal = deg % 90 === 0;
          const isMajor = deg % 30 === 0;
          const tickLen = isCardinal ? 12 : isMajor ? 8 : 4;
          const tickW = isCardinal ? 2 : 1;
          return (
            <span
              key={`t${i}`}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                width: `${tickW}px`,
                height: `${tickLen}px`,
                marginLeft: `${-tickW / 2}px`,
                marginTop: `${-tickLen}px`,
                backgroundColor: isCardinal ? '#94a3b8' : isMajor ? '#b0bac9' : '#d1d5db',
                transform: `rotate(${deg}deg) translateY(${-RADIUS_RATIO * 100}%)`,
                transformOrigin: `50% calc(100% + ${RADIUS_RATIO * 100}%)`,
                borderRadius: '1px',
              }}
            />
          );
        })}

        {/* Cardinal direction labels */}
        {CARDINAL_DIRS.map(({ label, deg, color, bold }) => {
          const rad = ((deg - 90) * Math.PI) / 180;
          const r = 38; // % from center
          const x = 50 + r * Math.cos(rad);
          const y = 50 + r * Math.sin(rad);
          return (
            <span
              key={label}
              className="absolute z-[2] text-[11px] leading-none"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                color,
                fontWeight: bold ? 700 : 600,
              }}
            >
              {label}
            </span>
          );
        })}

        {/* Compass needle */}
        {relativeBearing !== null && (
          <motion.svg
            className="absolute z-[5]"
            viewBox="0 0 100 100"
            style={{
              left: '50%',
              top: '50%',
              width: '55%',
              height: '55%',
              marginLeft: '-27.5%',
              marginTop: '-27.5%',
              filter: 'drop-shadow(0 2px 8px rgba(79, 70, 229, 0.35))',
            }}
            animate={{ rotate: relativeBearing }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* North half — indigo arrow */}
            <polygon points="50,10 60,48 50,43 40,48" fill="#4f46e5" />
            {/* South half — light tail */}
            <polygon points="50,90 40,52 50,57 60,52" fill="#cbd5e1" />
            {/* Center dot */}
            <circle cx="50" cy="50" r="3" fill="#4f46e5" />
          </motion.svg>
        )}

        {/* Center hub */}
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
