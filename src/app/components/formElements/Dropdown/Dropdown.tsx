'use client';

import {
  Controller,
  FieldValues,
  Path,
  PathValue,
  useFormContext,
} from 'react-hook-form';
import DropdownInput from './DropdownInput';
import { DropdownProps } from '@/app/interfaces/FormElements';

const Dropdown = <TFieldValues extends FieldValues>(
  rootProps: DropdownProps<TFieldValues>
) => {
  const {
    name,
    defaultValue = [],
    required = false,
    disabled = false,
    rules: _rules,
  } = rootProps;

  const methods = useFormContext<TFieldValues>();

  const rules = { required, ..._rules };

  return (
    <Controller
      control={methods.control}
      name={name}
      defaultValue={
        (defaultValue.length ? defaultValue : '') as PathValue<
          TFieldValues,
          Path<TFieldValues>
        >
      }
      rules={rules}
      disabled={disabled}
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
