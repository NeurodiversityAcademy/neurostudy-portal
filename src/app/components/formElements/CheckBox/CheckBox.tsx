'use client';

import {
  Controller,
  FieldValues,
  Path,
  PathValue,
  useFormContext,
} from 'react-hook-form';
import { CheckBoxProps } from '@/app/interfaces/FormElements';
import CheckBoxInput from './CheckBoxInput';

const CheckBox = <TFieldValues extends FieldValues>(
  rootProps: CheckBoxProps<TFieldValues>
) => {
  const {
    name,
    defaultValue = [],
    required = false,
    disabled = false,
    rules: _rules,
  } = rootProps;

  const { control } = useFormContext<TFieldValues>();

  const rules = { required, ..._rules };

  return (
    <Controller
      control={control}
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
        <CheckBoxInput {...rootProps} rules={rules} renderProps={props} />
      )}
    ></Controller>
  );
};

export default CheckBox;
