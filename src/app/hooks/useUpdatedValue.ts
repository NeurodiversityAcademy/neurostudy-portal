import { useRef } from 'react';
import { compare } from '../utilities/common';

const DEFAULT_VALUE = Symbol('default useUpdatedValue');

export default function useUpdatedValue<Value = unknown, DS = unknown>(
  dependentState: DS,
  setter: (curState: DS) => Value
): Value {
  const previousStateRef = useRef<DS>();
  // NOTE: DEFAULT_VALUE is not necessarily type Value, it is made
  // sure to be unique
  const valueRef = useRef(DEFAULT_VALUE as Value);
  if (!compare(dependentState, previousStateRef.current)) {
    previousStateRef.current = dependentState;
    valueRef.current = setter(dependentState);
  }

  return valueRef.current;
}
