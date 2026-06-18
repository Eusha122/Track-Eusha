import { useCallback, useEffect, useState } from 'react';

type HeadingPermission = 'unknown' | 'granted' | 'denied' | 'unsupported';

interface CompassOrientationEvent extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}

interface DeviceOrientationEventConstructorWithPermission {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

function readHeading(event: CompassOrientationEvent): number | null {
  if (typeof event.webkitCompassHeading === 'number') {
    return event.webkitCompassHeading;
  }
  if (event.absolute && event.alpha !== null) {
    return (360 - event.alpha) % 360;
  }
  return null;
}

export function useDeviceHeading() {
  const [heading, setHeading] = useState<number | null>(null);
  const [permission, setPermission] = useState<HeadingPermission>('unknown');

  useEffect(() => {
    if (!('DeviceOrientationEvent' in window)) {
      setPermission('unsupported');
      return;
    }

    const requestFn = (
      DeviceOrientationEvent as unknown as DeviceOrientationEventConstructorWithPermission
    ).requestPermission;

    if (typeof requestFn !== 'function') {
      setPermission('granted');
    }
  }, []);

  useEffect(() => {
    if (permission !== 'granted') return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const next = readHeading(event as CompassOrientationEvent);
      if (next !== null) setHeading(next);
    };

    window.addEventListener('deviceorientationabsolute', handleOrientation);
    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
      window.removeEventListener('deviceorientation', handleOrientation);
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
