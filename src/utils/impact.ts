import { useEffect, useState } from 'react';

// Cubic ease-out count-up animation hook
export function useCountUp(
  target: number,
  durationMs: number,
  start: boolean,
): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) {
      setValue(target);
      return;
    }
    setValue(0);
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / durationMs);
      setValue(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, durationMs]);
  return value;
}

export function formatValue(val: number): string {
  if (val === 0) return '0';
  if (val < 0.01) return val.toFixed(3);
  if (val < 0.1) return val.toFixed(2);
  if (val < 10) return val.toFixed(1);
  return val.toFixed(0);
}
