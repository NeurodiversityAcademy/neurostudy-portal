import React, { FocusEvent } from 'react';
import styles from './toggle.module.css';
import {
  DefaultValue,
  SelectOption,
  ToggleInputProps,
} from '@/app/interfaces/FormElements';
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
  options,
  helperText,
  required = false,
  defaultValue = false as DefaultValue<TFieldValues>,
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

  const setValue = (value: SelectOption['value']) => {
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
        {options.map(({ label, value: itemValue, label2 }) => (
          <div
            key={itemValue.toString()}
            role='checkbox'
            aria-disabled={disabled}
            aria-checked={value === itemValue}
            aria-label={label}
            className={styles.switchContainer}
          >
            <label className={styles.switch}>
              <input
                type='checkbox'
                disabled={disabled}
                onChange={() => {
                  setValue(value === itemValue);
                }}
              />
              <span className={classNames(styles.slider, styles.round)}></span>
            </label>
            <label className={styles.label}>
              {value === itemValue ? label : label2}
            </label>
          </div>
        ))}
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
