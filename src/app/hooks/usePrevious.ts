import { useRef } from 'react';

const DEFAULT_VALUE = Symbol('initialValue');

export default function usePrevious<S = unknown>(
  curState: S
): S | typeof DEFAULT_VALUE {
  const previousStateRef = useRef<typeof DEFAULT_VALUE | S>(DEFAULT_VALUE);
  const previousState = previousStateRef.current;
  let changed = false;
  if (
    Array.isArray(curState) &&
    Array.isArray(previousState) &&
    curState.length === previousState.length
  ) {
    changed = curState.some((item, index) => item !== previousState[index]);
  } else {
    changed = curState !== previousState;
  }

  if (changed) {
    previousStateRef.current = curState;
  }

  return previousState;
}
