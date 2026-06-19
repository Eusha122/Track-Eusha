import { useCallback, useEffect, useRef, useState } from 'react';

type HeadingPermission = 'unknown' | 'granted' | 'denied' | 'unsupported';

interface CompassOrientationEvent extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}

interface DeviceOrientationEventConstructorWithPermission {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

// Smoothing factor for compass heading to prevent jitter
const HEADING_SMOOTH_ALPHA = 0.25;

function readHeading(event: CompassOrientationEvent): number | null {
  // iOS: webkitCompassHeading is already a true-north compass heading
  if (typeof event.webkitCompassHeading === 'number') {
    return event.webkitCompassHeading;
  }
  // Android / others: alpha gives compass heading when available
  if (event.alpha !== null) {
    return (360 - event.alpha) % 360;
  }
  return null;
}

// Smooth angle interpolation that handles the 0°/360° wraparound correctly
function smoothAngle(prev: number, next: number, alpha: number): number {
  let diff = next - prev;
  // Normalize to [-180, 180]
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return (prev + alpha * diff + 360) % 360;
}

export function useDeviceHeading() {
  const [heading, setHeading] = useState<number | null>(null);
  const [permission, setPermission] = useState<HeadingPermission>(() => {
    if (!('DeviceOrientationEvent' in window)) return 'unsupported';
    const requestFn = (
      DeviceOrientationEvent as unknown as DeviceOrientationEventConstructorWithPermission
    ).requestPermission;
    // Android / non-iOS: no permission API needed, so it's safe to start listening.
    return typeof requestFn !== 'function' ? 'granted' : 'unknown';
  });
  const smoothedRef = useRef<number | null>(null);
  const hasAbsoluteRef = useRef(false);

  useEffect(() => {
    if (permission !== 'granted') return;

    const handleOrientation = (event: DeviceOrientationEvent, isAbsolute: boolean) => {
      // If we already have absolute events, ignore non-absolute ones
      if (hasAbsoluteRef.current && !isAbsolute) return;
      if (isAbsolute) hasAbsoluteRef.current = true;

      const raw = readHeading(event as CompassOrientationEvent);
      if (raw === null) return;

      // Smooth the heading to prevent jitter
      if (smoothedRef.current === null) {
        smoothedRef.current = raw;
      } else {
        smoothedRef.current = smoothAngle(smoothedRef.current, raw, HEADING_SMOOTH_ALPHA);
      }

      setHeading(smoothedRef.current);
    };

    const onAbsolute = (e: DeviceOrientationEvent) => handleOrientation(e, true);
    const onRegular = (e: DeviceOrientationEvent) => handleOrientation(e, false);

    // Prefer absolute orientation (true compass heading on Android)
    window.addEventListener('deviceorientationabsolute', onAbsolute);
    window.addEventListener('deviceorientation', onRegular);

    return () => {
      window.removeEventListener('deviceorientationabsolute', onAbsolute);
      window.removeEventListener('deviceorientation', onRegular);
    };
  }, [permission]);

  const requestPermission = useCallback(async () => {
    const requestFn = (
      DeviceOrientationEvent as unknown as DeviceOrientationEventConstructorWithPermission
    ).requestPermission;

    if (typeof requestFn !== 'function') {
      setPermission('granted');
      return;
    }

    try {
      const result = await requestFn();
      setPermission(result === 'granted' ? 'granted' : 'denied');
    } catch {
      setPermission('denied');
    }
  }, []);

  return { heading, permission, requestPermission };
}
