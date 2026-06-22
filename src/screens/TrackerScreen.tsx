import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { ScreenHeading } from '../components/ui/ScreenHeading';
import { ScreenShell } from '../components/ui/ScreenShell';
import { SectionLabel } from '../components/ui/SectionLabel';
import { useLocationBroadcaster } from '../hooks/useLocationBroadcaster';
import { useHunterLocation } from '../hooks/useHunterLocation';
import type { AccuracyLevel } from '../hooks/useLocationBroadcaster';
import { EASE_CINEMATIC } from '../lib/motion';

function formatSyncTime(timestamp: number | null) {
  if (timestamp === null) return '—';
  return new Date(timestamp).toTimeString().slice(0, 8);
}

const ACCURACY_CONFIG: Record<NonNullable<AccuracyLevel>, { label: string; color: string; textColor: string; bg: string; border: string }> = {
  excellent: { label: '● Excellent', color: 'bg-emerald-500', textColor: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  good:      { label: '● Good',      color: 'bg-emerald-400', textColor: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  fair:      { label: '● Fair',      color: 'bg-amber-400',   textColor: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/20' },
  poor:      { label: '● Poor',      color: 'bg-orange-500',  textColor: 'text-orange-400',  bg: 'bg-orange-500/10',  border: 'border-orange-500/20' },
  unusable:  { label: '● Unusable',  color: 'bg-rose-500',    textColor: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/20' },
};

function formatTimestamp(epoch: number) {
  return new Date(epoch * 1000).toTimeString().slice(0, 8);
}

export function TrackerScreen() {
  const { status, error, syncError, position, lastSyncAt, accuracyLevel, start } = useLocationBroadcaster();
  const { hunter, isOffline: hunterOffline } = useHunterLocation();

  const sharingStatus = (() => {
    if (status === 'active' && accuracyLevel === 'unusable') return { label: 'Blocked — Accuracy Too Low', color: 'bg-rose-500', pulse: false, textColor: 'text-rose-400' } as const;
    if (status === 'active' && syncError) return { label: 'Sync Failed', color: 'bg-rose-500', pulse: false, textColor: 'text-rose-400' } as const;
    if (status === 'active' && lastSyncAt) return { label: 'Sharing Active', color: 'bg-emerald-500', pulse: true, textColor: 'text-emerald-400' } as const;
    if (status === 'active') return { label: 'Acquiring Signal…', color: 'bg-amber-400', pulse: true, textColor: 'text-amber-400' } as const;
    if (status === 'requesting') return { label: 'Requesting Permission', color: 'bg-amber-400', pulse: true, textColor: 'text-amber-400' } as const;
    if (status === 'error') return { label: 'Location Error', color: 'bg-rose-500', pulse: false, textColor: 'text-rose-400' } as const;
    return { label: 'Not Sharing', color: 'bg-white/30', pulse: false, textColor: 'text-white/40' } as const;
  })();

  const accConfig = accuracyLevel ? ACCURACY_CONFIG[accuracyLevel] : null;
  const showAccuracyWarning = accuracyLevel === 'poor' || accuracyLevel === 'unusable';

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
            <p className="text-xs text-amber-400/70">
              ⚠ For accurate results, always share from a <strong>phone</strong> with GPS enabled — not a laptop or desktop.
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
              {/* ── Accuracy Level (prominent) ── */}
              <div className="flex items-baseline justify-between gap-4">
                <SectionLabel>GPS Accuracy</SectionLabel>
                <div className="flex items-center gap-2">
                  <span className="text-white">
                    {position ? `${Math.round(position.coords.accuracy)}m` : '—'}
                  </span>
                  {accConfig && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${accConfig.bg} ${accConfig.border} ${accConfig.textColor} border`}>
                      {accConfig.label}
                    </span>
                  )}
                </div>
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

            {/* ── Accuracy Warning ── */}
            {showAccuracyWarning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-left"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  ⚠ Low Accuracy Detected
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-amber-300/70">
                  {accuracyLevel === 'unusable'
                    ? 'Location data is too inaccurate to sync — broadcasting is paused. This device is using WiFi/IP positioning instead of GPS.'
                    : 'Your position may be off by hundreds of meters. Results on the Command Center will be unreliable.'}
                </p>
                <p className="mt-2 text-xs font-medium text-amber-200/80">
                  → Open this page on your <strong>phone</strong> with GPS enabled for accurate tracking.
                </p>
              </motion.div>
            )}

            {syncError && !showAccuracyWarning && (
              <p className="mt-4 border-t border-white/10 pt-4 text-xs text-white/40">
                Sync failed: {syncError}
              </p>
            )}
          </motion.div>
        )}

        {/* ── Hunter (Tasmia) Location Intel ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE_CINEMATIC }}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left"
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              {hunter && !hunterOffline && (
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-indigo-400"
                  animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                hunter ? (hunterOffline ? 'bg-amber-400' : 'bg-indigo-400') : 'bg-white/30'
              }`} />
            </span>
            <span className="text-lg font-medium text-white">Hunter Intel</span>
            <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${
              hunter
                ? hunterOffline
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                : 'bg-white/5 border-white/10 text-white/30'
            }`}>
              {hunter ? (hunterOffline ? '● Offline' : '● Live') : '● No Data'}
            </span>
          </div>

          <p className="mt-1.5 text-xs text-white/35">
            Tasmia's live location
          </p>

          {hunter ? (
            <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 text-sm">
              <div className="flex items-baseline justify-between gap-4">
                <SectionLabel>Coordinates</SectionLabel>
                <span className="text-white">
                  {hunter.latitude.toFixed(5)}, {hunter.longitude.toFixed(5)}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <SectionLabel>Accuracy</SectionLabel>
                <span className="text-white">{Math.round(hunter.accuracy)}m</span>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <SectionLabel>Last Update</SectionLabel>
                <span className="text-white">{formatTimestamp(hunter.timestamp)}</span>
              </div>
            </div>
          ) : (
            <p className="mt-4 border-t border-white/10 pt-4 text-xs text-white/35">
              Waiting for Tasmia to open the app…
            </p>
          )}
        </motion.div>

      </div>
    </ScreenShell>
  );
}
