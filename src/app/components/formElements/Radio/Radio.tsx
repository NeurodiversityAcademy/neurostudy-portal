'use client';

import {
  Controller,
  FieldValues,
  Path,
  PathValue,
  useFormContext,
} from 'react-hook-form';
import { RadioProps } from '@/app/interfaces/FormElements';
import RadioInput from './RadioInput';

const Radio = <TFieldValues extends FieldValues>(
  rootProps: RadioProps<TFieldValues>
) => {
  const {
    name,
    defaultValue,
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
      defaultValue={defaultValue as PathValue<TFieldValues, Path<TFieldValues>>}
      rules={rules}
      disabled={disabled}
      render={(props) => (
        <RadioInput<TFieldValues>
          {...rootProps}
          rules={rules}
          renderProps={props}
        />
      )}
    ></Controller>
  );
};

export default Radio;
