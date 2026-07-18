import { useCallback } from 'react';

export const HIDE_OVERFLOW_CLASS = 'nda-hide-overflow';

const useHideOverflowEffect = (elem?: HTMLElement) => {
  return useCallback(() => {
    const target = elem ?? document.body;
    target.classList.add(HIDE_OVERFLOW_CLASS);

    return () => {
      target.classList.remove(HIDE_OVERFLOW_CLASS);
    };
  }, [elem]);
};

export default useHideOverflowEffect;
