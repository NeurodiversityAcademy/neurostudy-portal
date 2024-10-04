'use client';

import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import { DefaultValue, SliderProps } from '@/app/interfaces/FormElements';
import SliderInput from './SliderInput';
import {
  DEFAULT_SLIDER_MAX,
  DEFAULT_SLIDER_MIN,
  DEFAULT_SLIDER_STEP,
} from '@/app/utilities/constants';

const Slider = <TFieldValues extends FieldValues>(
  rootProps: SliderProps<TFieldValues>
) => {
  const {
    name,
    disabled,
    min = DEFAULT_SLIDER_MIN,
    max = DEFAULT_SLIDER_MAX,
    step = DEFAULT_SLIDER_STEP,
    rules: _rules,
  } = rootProps;
  const { defaultValue = min as DefaultValue<TFieldValues> } = rootProps;
  // TODO: Force min < max, step <= max - min, min <= defaultValue <= max

  const methods = useFormContext<TFieldValues>();
  const rules = { ..._rules };

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
        <SliderInput<TFieldValues>
          {...rootProps}
          methods={methods}
          rules={rules}
          renderProps={props}
          min={min}
          max={max}
          step={step}
        />
      )}
    ></Controller>
  );
};

export default Slider;
