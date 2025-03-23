import { useCallback, useRef, useSyncExternalStore } from 'react';

const MIN_WIDTH = 276;
const GAP = 12;

// repeat(auto-fill, minmax(276px, 1fr)) を計算で求める
export function useCarouselItemWidth<T extends Element>() {
  const { ref: containerRef, width: containerWidth } = useClientWidth<T>();

  if (containerRef.current == null || containerWidth === undefined) {
    return { ref: containerRef, width: MIN_WIDTH };
  }

  const styles = window.getComputedStyle(containerRef.current);
  const innerWidth = containerWidth - parseInt(styles.paddingLeft) - parseInt(styles.paddingRight);
  const itemCount = Math.max(0, Math.floor((innerWidth + GAP) / (MIN_WIDTH + GAP)));
  const itemWidth = Math.floor((innerWidth + GAP) / itemCount - GAP);

  return { ref: containerRef, width: itemWidth };
}

export function useClientWidth<T extends Element>() {
  const ref = useRef<T>(null);

  const subscribe = useCallback((callback: () => void) => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach(() => {
        callback();
      });
    });
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  const width = useSyncExternalStore(
    subscribe,
    () => {
      return ref.current?.clientWidth;
    },
    () => undefined,
  );

  return { ref, width };
}
