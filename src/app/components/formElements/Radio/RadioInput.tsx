import React, { FocusEvent } from 'react';
import styles from './radio.module.css';
import { SelectOption, RadioInputProps } from '@/app/interfaces/FormElements';
import CheckBoxItem from '../CheckBoxItem/CheckBoxItem';
import { FieldValues } from 'react-hook-form';
import Label from '../Label/Label';
import HelperText from '../HelperText/HelperText';
import ErrorBox from '../ErrorBox/ErrorBox';
import classNames from 'classnames';
import useDefaultValue from '@/app/hooks/useDefaultValue';

const RadioInput = <TFieldValues extends FieldValues>({
  name,
  label,
  showLabel = false,
  options,
  helperText,
  required = false,
  defaultValue,
  onChange,
  orientation = 'horizontal',
  defaultErrorMessage,
  renderProps,
  methods,
}: RadioInputProps<TFieldValues>) => {
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
      className={styles.radioRoot}
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
      <div className={classNames(styles.radioContainer, styles[orientation])}>
        {options.map(({ label, value: itemValue }) => (
          <CheckBoxItem
            key={itemValue.toString()}
            label={label}
            disabled={disabled}
            type='radio'
            checked={value === itemValue}
            onChange={() => {
              setValue(itemValue);
            }}
          />
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

export default RadioInput;
