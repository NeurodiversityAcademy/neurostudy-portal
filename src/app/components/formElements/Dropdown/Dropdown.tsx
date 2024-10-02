'use client';

import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import DropdownInput from './DropdownInput';
import { DropdownProps } from '@/app/interfaces/FormElements';

const Dropdown = <TFieldValues extends FieldValues>(
  rootProps: DropdownProps<TFieldValues>
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
      defaultValue={defaultValue}
      rules={rules}
      // NOTE
      // `react-hook-form@7.52.0` sets up `isDirty` status of
      // the input in a weird way if `disabled` is set as a non-undefined value
      disabled={disabled || undefined}
      render={(props) => (
        <DropdownInput<TFieldValues>
          {...rootProps}
          methods={methods}
          rules={rules}
          renderProps={props}
        />
      )}
    ></Controller>
  );
};

export default Dropdown;
