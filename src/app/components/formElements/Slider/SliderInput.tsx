import React, { FocusEvent, useEffect, useRef } from 'react';
import styles from './slider.module.css';
import { DefaultValue, SliderInputProps } from '@/app/interfaces/FormElements';
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
  defaultValue = 50 as DefaultValue<TFieldValues>,
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
    if (sliderRef.current) {
      sliderRef.current.style.setProperty('--slider-value', `${value}%`);
    }
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.setProperty('--slider-value', `${defaultValue}%`);
    }
  }, [defaultValue]);

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
      {value != undefined && (
        <input
          key={value.toString()}
          type='hidden'
          name={name}
          value={typeof value === 'boolean' ? value.toString() : value}
        />
      )}
    </div>
  );
};

export default SliderInput;
