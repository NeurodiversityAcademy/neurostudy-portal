import { useSyncExternalStore } from 'react';
import { throttle } from '../utilities/common';

const subscribe = (onStoreChange: () => void): (() => void) => {
  const updateWidth = throttle(onStoreChange);
  window.addEventListener('resize', updateWidth);
  return () => {
    window.removeEventListener('resize', updateWidth);
  };
};

const getSnapshot = (): number => window.innerWidth;

const useWindowWidth = (defaultWidth: number = 1150): number => {
  return useSyncExternalStore(subscribe, getSnapshot, () => defaultWidth);
};

export default useWindowWidth;
