import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { ScreenHeading } from '../components/ui/ScreenHeading';
import { ScreenShell } from '../components/ui/ScreenShell';
import { SectionLabel } from '../components/ui/SectionLabel';
import { useLocationBroadcaster } from '../hooks/useLocationBroadcaster';
import { EASE_CINEMATIC } from '../lib/motion';

function formatSyncTime(timestamp: number | null) {
  if (timestamp === null) return '—';
  return new Date(timestamp).toTimeString().slice(0, 8);
}

export function TrackerScreen() {
  const { status, error, syncError, position, lastSyncAt, start } = useLocationBroadcaster();

  const sharingStatus = (() => {
    if (status === 'active' && syncError) return { label: 'Sync Failed', color: 'bg-rose-500', pulse: false, textColor: 'text-rose-400' } as const;
    if (status === 'active' && lastSyncAt) return { label: 'Sharing Active', color: 'bg-emerald-500', pulse: true, textColor: 'text-emerald-400' } as const;
    if (status === 'active') return { label: 'Acquiring Signal…', color: 'bg-amber-400', pulse: true, textColor: 'text-amber-400' } as const;
    if (status === 'requesting') return { label: 'Requesting Permission', color: 'bg-amber-400', pulse: true, textColor: 'text-amber-400' } as const;
    if (status === 'error') return { label: 'Location Error', color: 'bg-rose-500', pulse: false, textColor: 'text-rose-400' } as const;
    return { label: 'Not Sharing', color: 'bg-white/30', pulse: false, textColor: 'text-white/40' } as const;
  })();

  return (
    <ScreenShell maxWidthClassName="max-w-sm">
      <div className="flex flex-col items-center gap-10 text-center">
        <ScreenHeading>Tracker Mode</ScreenHeading>

        {/* ── Location Sharing Status Badge ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: EASE_CINEMATIC }}
          className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 backdrop-blur-sm"
        >
          <span className="relative flex h-2.5 w-2.5">
            {sharingStatus.pulse && (
              <motion.span
                className={`absolute inline-flex h-full w-full rounded-full ${sharingStatus.color}`}
                animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${sharingStatus.color}`} />
          </span>
          <span className={`text-sm font-medium ${sharingStatus.textColor}`}>
            {sharingStatus.label}
          </span>
        </motion.div>

        {status === 'idle' && (
          <>
            <p className="text-sm text-white/45">
              This device will broadcast its live location. Keep this tab open.
            </p>
            <Button onClick={start}>Start Broadcasting</Button>
          </>
        )}

        {status === 'requesting' && (
          <p className="text-sm text-white/45">Requesting location permission…</p>
        )}

        {status === 'error' && (
          <div className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left text-sm text-white/55">
            {error ?? 'Location is unavailable on this device.'}
          </div>
        )}

        {status === 'active' && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_CINEMATIC }}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left"
          >
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-white/40"
                  animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
              </span>
              <span className="text-lg font-medium text-white">Tracking Active</span>
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 text-sm">
              <div className="flex items-baseline justify-between gap-4">
                <SectionLabel>GPS Accuracy</SectionLabel>
                <span className="text-white">
                  {position ? `${Math.round(position.coords.accuracy)}m` : '—'}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <SectionLabel>Coordinates</SectionLabel>
                <span className="text-white">
                  {position
                    ? `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`
                    : '—'}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <SectionLabel>Last Sync</SectionLabel>
                <span className="text-white">{formatSyncTime(lastSyncAt)}</span>
              </div>
            </div>

            {syncError && (
              <p className="mt-4 border-t border-white/10 pt-4 text-xs text-white/40">
                Sync failed: {syncError}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </ScreenShell>
  );
}
