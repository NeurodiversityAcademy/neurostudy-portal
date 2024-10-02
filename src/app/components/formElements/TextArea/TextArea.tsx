'use client';

import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import { DefaultValue, TextAreaProps } from '@/app/interfaces/FormElements';
import TextAreaInput from './TextAreaInput';

const TextArea = <TFieldValues extends FieldValues>(
  rootProps: TextAreaProps<TFieldValues>
) => {
  const {
    name,
    defaultValue = '' as DefaultValue<TFieldValues>,
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
        <TextAreaInput<TFieldValues>
          {...rootProps}
          methods={methods}
          rules={rules}
          renderProps={props}
        />
      )}
    />
  );
};

export default TextArea;
