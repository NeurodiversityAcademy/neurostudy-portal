import { useRef } from 'react';
import usePrevious from './usePrevious';

export default function useUpdatedValue<V = unknown, S = unknown>(
  curState: S,
  setter: (curState: S) => V
): V {
  const previousState = usePrevious<S>(curState);
  const valueRef = useRef('' as V);
  if (previousState !== curState) {
    valueRef.current = setter(curState);
  }
  return valueRef.current;
}
