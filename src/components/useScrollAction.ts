import { useCallback, useEffect, useRef, useState } from 'react';
import { getLenis } from '../lib/lenis';

export type ActionPhase = 'idle' | 'loading' | 'arrow';

const LOAD_MS = 350;
const ARROW_MS = 300;
const NAV_OFFSET = -80; // alto del navbar fijo

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset: NAV_OFFSET });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function useScrollAction(targetId: string) {
  const [phase, setPhase] = useState<ActionPhase>('idle');
  // El ref bloquea clics repetidos al instante, sin depender del render
  const busy = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  const trigger = useCallback(() => {
    if (busy.current) return;
    busy.current = true;

    setPhase('loading');

    timers.current.push(
      window.setTimeout(() => setPhase('arrow'), LOAD_MS)
    );

    timers.current.push(
      window.setTimeout(() => {
        scrollToId(targetId);
        setPhase('idle');
        busy.current = false;
      }, LOAD_MS + ARROW_MS)
    );
  }, [targetId]);

  return { phase, trigger };
}