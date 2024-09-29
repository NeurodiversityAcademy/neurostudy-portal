'use client';

import {
  Controller,
  FieldValues,
  Path,
  PathValue,
  useFormContext,
} from 'react-hook-form';
import { SliderProps } from '@/app/interfaces/FormElements';
import SliderInput from './SliderInput';

const Slider = <TFieldValues extends FieldValues>(
  rootProps: SliderProps<TFieldValues>
) => {
  const { name, defaultValue, disabled, rules: _rules } = rootProps;
  const methods = useFormContext<TFieldValues>();
  const rules = { ..._rules };

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
        <SliderInput<TFieldValues>
          {...rootProps}
          methods={methods}
          rules={rules}
          renderProps={props}
        />
      )}
    ></Controller>
  );
};

export default Slider;
