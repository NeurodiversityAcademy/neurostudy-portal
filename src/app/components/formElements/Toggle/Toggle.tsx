'use client';

import {
  Controller,
  FieldValues,
  Path,
  PathValue,
  useFormContext,
} from 'react-hook-form';
import { ToggleProps } from '@/app/interfaces/FormElements';
import ToggleInput from './ToggleInput';

const Toggle = <TFieldValues extends FieldValues>(
  rootProps: ToggleProps<TFieldValues>
) => {
  const {
    name,
    defaultValue,
    required = false,
    disabled,
    rules: _rules,
  } = rootProps;
  const methods = useFormContext<TFieldValues>();
  const rules = { required, ..._rules };

  return (
    <Controller
      control={methods.control}
      name={name}
      defaultValue={defaultValue as PathValue<TFieldValues, Path<TFieldValues>>}
      rules={rules}
      // NOTE
      // `react-hook-form@7.52.0` sets up `isDirty` status of
      // the input in a weird way if `disabled` is set as a non-undefined value
      disabled={disabled || undefined}
      render={(props) => (
        <ToggleInput<TFieldValues>
          {...rootProps}
          methods={methods}
          rules={rules}
          renderProps={props}
        />
      )}
    ></Controller>
  );
};

export default Toggle;
