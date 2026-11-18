import { useEffect, useState } from 'react';
import { nextTargets, popperDepth, toggleTargets } from '~/utils/hoverTargets';

export type HoverTarget = {
  depth: number;
  element: HTMLElement;
  value: string;
};

type Found = Omit<HoverTarget, 'depth'>;

const LINGER = 150;

export function useHoverTargets(attribute: string): HoverTarget[] {
  const [targets, setTargets] = useState<HoverTarget[]>([]);

  useEffect(() => {
    const selector = `[data-${attribute}]`;
    let touch = false;
    let timer: number | undefined;

    const cancel = () => window.clearTimeout(timer);
    const clearSoon = () => {
      cancel();
      timer = window.setTimeout(() => setTargets([]), LINGER);
    };

    const find = (event: Event): Found | null => {
      const node = event.target;
      const element = node instanceof Element ? node.closest<HTMLElement>(selector) : null;
      return element ? { element, value: element.getAttribute(`data-${attribute}`) ?? '' } : null;
    };

    const handleDown = (event: PointerEvent) => {
      touch = event.pointerType !== 'mouse';
    };

    const handleOver = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const found = find(event);
      const inside = popperDepth(event.target);
      if (!found && inside < 0) {
        clearSoon();
        return;
      }
      cancel();
      setTargets((old) => nextTargets(old, inside, found));
    };

    const handleLeave = () => {
      if (!touch) clearSoon();
    };

    const handleClick = (event: MouseEvent) => {
      if (!touch) return;
      const found = find(event);
      const inside = popperDepth(event.target);
      setTargets((old) => (found || inside >= 0
        ? toggleTargets(old, inside, found)
        : []));
    };

    document.addEventListener('pointerdown', handleDown);
    document.addEventListener('pointerover', handleOver);
    document.documentElement.addEventListener('pointerleave', handleLeave);
    document.addEventListener('click', handleClick);
    return () => {
      cancel();
      document.removeEventListener('pointerdown', handleDown);
      document.removeEventListener('pointerover', handleOver);
      document.documentElement.removeEventListener('pointerleave', handleLeave);
      document.removeEventListener('click', handleClick);
    };
  }, [attribute]);

  return targets;
}
