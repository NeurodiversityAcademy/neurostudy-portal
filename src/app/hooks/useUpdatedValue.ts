import { useState } from 'react';
import { compare } from '../utilities/common';

export default function useUpdatedValue<Value = unknown, DS = unknown>(
  dependentState: DS,
  setter: (curState: DS) => Value,
): Value {
  const [cache, setCache] = useState(() => ({
    state: dependentState,
    value: setter(dependentState),
  }));

  if (!compare(dependentState, cache.state)) {
    const nextValue = setter(dependentState);
    setCache({ state: dependentState, value: nextValue });
    return nextValue;
  }

  return cache.value;
}
