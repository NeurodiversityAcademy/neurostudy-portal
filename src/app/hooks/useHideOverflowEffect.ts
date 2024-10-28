import { useCallback } from 'react';

const useHideOverflowEffect = (elem?: HTMLElement) => {
  return useCallback(() => {
    const { style } = elem || document.body;
    const oldOverflow = style.overflow;
    style.overflow = 'hidden';

    return () => {
      if (oldOverflow) {
        style.overflow = oldOverflow;
      } else {
        style.removeProperty('overflow');
      }
    };
  }, [elem]);
};

export default useHideOverflowEffect;
