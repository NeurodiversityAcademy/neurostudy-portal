import React, { FocusEvent } from 'react';
import styles from './radio.module.css';
import {
  RadioProps,
  SelectOption,
  RenderProps,
} from '@/app/interfaces/FormElements';
import CheckBoxItem from '../CheckBoxItem/CheckBoxItem';
import { FieldValues } from 'react-hook-form';
import Label from '../Label/Label';
import HelperText from '../HelperText/HelperText';
import ErrorBox from '../ErrorBox/ErrorBox';
import classNames from 'classnames';

interface PropType<TFieldValues extends FieldValues>
  extends RadioProps<TFieldValues> {
  renderProps: RenderProps<TFieldValues>;
}

const RadioInput = <TFieldValues extends FieldValues>({
  name,
  label,
  showLabel = false,
  options,
  helperText,
  required = false,
  onChange,
  orientation = 'horizontal',
  renderProps,
  defaultErrorMessage,
}: PropType<TFieldValues>) => {
  const {
    field,
    formState: { errors },
  } = renderProps;

  const { disabled, onBlur, value } = field;

  const error = errors[name];

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
            type='radio'
            selected={value === itemValue}
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
