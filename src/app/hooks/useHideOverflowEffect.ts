import { useCallback } from 'react';

const useHideOverflowEffect = (elem: HTMLElement = document.body) => {
  return useCallback(() => {
    const { style } = elem;
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
