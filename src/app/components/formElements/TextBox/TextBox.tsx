'use client';

import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import { DefaultValue, TextBoxProps } from '@/app/interfaces/FormElements';
import TextBoxInput from './TextBoxInput';

const TextBox = <TFieldValues extends FieldValues>(
  rootProps: TextBoxProps<TFieldValues>
) => {
  const {
    name,
    defaultValue = '' as DefaultValue<TFieldValues>,
    required = false,
    disabled,
    pattern,
    rules: _rules,
  } = rootProps;

  const methods = useFormContext<TFieldValues>();

  const rules = {
    required,
    pattern,
    ..._rules,
  };

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
        <TextBoxInput<TFieldValues>
          {...rootProps}
          methods={methods}
          rules={rules}
          renderProps={props}
        />
      )}
    />
  );
};

export default TextBox;
