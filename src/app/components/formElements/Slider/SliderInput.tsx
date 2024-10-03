import React, { FocusEvent, useEffect, useRef } from 'react';
import styles from './slider.module.css';
import { SliderInputProps } from '@/app/interfaces/FormElements';
import { FieldValues } from 'react-hook-form';
import Label from '../Label/Label';
import HelperText from '../HelperText/HelperText';
import ErrorBox from '../ErrorBox/ErrorBox';
import useDefaultValue from '@/app/hooks/useDefaultValue';

const SliderInput = <TFieldValues extends FieldValues>({
  name,
  label,
  showLabel = false,
  helperText,
  defaultValue,
  onChange,
  defaultErrorMessage,
  renderProps,
  methods,
}: SliderInputProps<TFieldValues>) => {
  const {
    field,
    formState: { errors },
  } = renderProps;
  const error = errors[name];
  const { disabled, onBlur, value } = field;

  const sliderRef = useRef<HTMLInputElement>(null);

  useDefaultValue<TFieldValues>({
    renderProps,
    defaultValue,
    setValue: methods.setValue,
  });

  const setValue = (value: number) => {
    field.onChange(value);
    onChange?.(value);
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.setProperty('--slider-value', `${value}%`);
    }
  }, [value]);

  return (
    <div
      className={styles.sliderRoot}
      role='group'
      aria-disabled={disabled}
      onBlurCapture={(e: FocusEvent<HTMLDivElement, Element>) => {
        !(e.currentTarget as Node)?.contains(e.relatedTarget as Node) &&
          onBlur();
      }}
    >
      {showLabel && <Label name={name} color={error && 'red'} label={label} />}
      <div>
        <input
          type='range'
          min={0}
          max={100}
          value={value}
          ref={sliderRef}
          onChange={(e) => {
            setValue(Number(e.target.value));
          }}
        />
      </div>
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
