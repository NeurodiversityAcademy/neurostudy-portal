'use client';

import React, { CSSProperties } from 'react';
import styles from './slider.module.css';
import { SliderInputProps } from '@/app/interfaces/FormElements';
import { FieldValues } from 'react-hook-form';
import Label from '../Label/Label';
import HelperText from '../HelperText/HelperText';
import ErrorBox from '../ErrorBox/ErrorBox';
import useDefaultValue from '@/app/hooks/useDefaultValue';
import classNames from 'classnames';

const SliderInput = <TFieldValues extends FieldValues>({
  name,
  label,
  showLabel = false,
  helperText,
  defaultValue,
  min,
  max,
  step,
  onChange,
  cols,
  defaultErrorMessage,
  renderProps,
  methods,
}: SliderInputProps<TFieldValues>) => {
  const {
    field,
    formState: { errors },
  } = renderProps;
  const error = errors[name];

  useDefaultValue<TFieldValues>({
    renderProps,
    defaultValue,
    setValue: methods.setValue,
  });

  const setValue = (value: number) => {
    field.onChange(value);
    onChange?.(value);
  };

  return (
    <div
      className={classNames(
        styles.sliderRoot,
        'border-box-parent',
        cols && 'col-md-' + cols
      )}
    >
      {showLabel && <Label name={name} color={error && 'red'} label={label} />}
      <input
        type='range'
        style={
          {
            '--slider-value': ((field.value - min) / (max - min)) * 100 + '%',
          } as CSSProperties
        }
        className={styles.input}
        min={min}
        max={max}
        step={step}
        {...field}
        onChange={(e) => {
          setValue(Number(e.target.value));
        }}
      />
      <HelperText>{helperText}</HelperText>
      {error && (
        <ErrorBox
          message={error.message?.toString() || defaultErrorMessage}
          label={label}
        />
      )}
    </div>
  );
};

export default SliderInput;
