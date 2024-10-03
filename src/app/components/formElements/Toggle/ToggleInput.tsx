import React, { FocusEvent } from 'react';
import styles from './toggle.module.css';
import { DefaultValue, ToggleInputProps } from '@/app/interfaces/FormElements';
import { FieldValues } from 'react-hook-form';
import Label from '../Label/Label';
import HelperText from '../HelperText/HelperText';
import ErrorBox from '../ErrorBox/ErrorBox';
import classNames from 'classnames';
import useDefaultValue from '@/app/hooks/useDefaultValue';

const ToggleInput = <TFieldValues extends FieldValues>({
  name,
  label,
  showLabel = false,
  offLabel = 'OFF',
  onLabel = 'ON',
  helperText,
  required = false,
  defaultValue = offLabel as DefaultValue<TFieldValues>,
  onChange,
  orientation = 'horizontal',
  defaultErrorMessage,
  renderProps,
  methods,
}: ToggleInputProps<TFieldValues>) => {
  const {
    field,
    formState: { errors },
  } = renderProps;
  const error = errors[name];
  const { disabled, onBlur, value } = field;

  useDefaultValue<TFieldValues>({
    renderProps,
    defaultValue,
    setValue: methods.setValue,
  });

  const setValue = (value: string) => {
    field.onChange(value);
    onChange?.(value);
  };

  return (
    <div
      className={styles.toggleRoot}
      role='group'
      aria-disabled={disabled}
      onBlurCapture={(e: FocusEvent<HTMLDivElement, Element>) => {
        !(e.currentTarget as Node)?.contains(e.relatedTarget as Node) &&
          onBlur();
      }}
    >
      {showLabel && (
        <Label
          name={name}
          color={error && 'red'}
          label={label}
          required={required}
        />
      )}
      <div className={classNames(styles.toggleContainer, styles[orientation])}>
        <div className={styles.switchContainer}>
          <label className={styles.switch}>
            <input
              type='checkbox'
              disabled={disabled}
              onChange={() => {
                setValue(value === onLabel ? offLabel : onLabel);
              }}
            />
            <span
              className={classNames(styles.toggleSlider, styles.round)}
            ></span>
          </label>
          <div className={styles.label}>
            {value === offLabel ? offLabel : onLabel}
          </div>
        </div>
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

export default ToggleInput;
