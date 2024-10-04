import React, { useId } from 'react';
import styles from './toggle.module.css';
import { SelectOption, ToggleInputProps } from '@/app/interfaces/FormElements';
import { FieldValues } from 'react-hook-form';
import Label from '../Label/Label';
import HelperText from '../HelperText/HelperText';
import ErrorBox from '../ErrorBox/ErrorBox';
import useDefaultValue from '@/app/hooks/useDefaultValue';
import { DEFAULT_TOGGLE_OPTIONS } from '@/app/utilities/constants';
import classNames from 'classnames';
import { getLabelOption } from '@/app/utilities/common';

const ToggleInput = <TFieldValues extends FieldValues>({
  name,
  label,
  showLabel = false,
  options = DEFAULT_TOGGLE_OPTIONS,
  helperText,
  required = false,
  defaultValue,
  onChange,
  cols,
  defaultErrorMessage,
  renderProps,
  methods,
}: ToggleInputProps<TFieldValues>) => {
  const {
    field,
    formState: { errors },
  } = renderProps;
  const error = errors[name];
  const { value } = field;

  const inputId = useId();

  useDefaultValue<TFieldValues>({
    renderProps,
    defaultValue,
    setValue: methods.setValue,
  });

  const onOption = getLabelOption(options.on);
  const offOption = getLabelOption(options.off);

  const setValue = (value: SelectOption['value']) => {
    field.onChange(value);
    onChange?.(value);
  };

  const toggle = () => {
    setValue(value === onOption.value ? offOption.value : onOption.value);
  };

  return (
    <div
      className={classNames(
        styles.toggleRoot,
        'border-box-parent',
        cols && 'col-md-' + cols
      )}
    >
      {showLabel && (
        <Label
          name={name}
          color={error && 'red'}
          label={label}
          required={required}
        />
      )}
      <div
        className={styles.switchContainer}
        onClick={(e) => e.currentTarget === e.target && toggle()}
      >
        <input
          id={inputId}
          type='checkbox'
          className={styles.input}
          {...field}
          checked={value === onOption.value}
          name={undefined}
          value={undefined}
          onChange={toggle}
        />
        <label htmlFor={inputId} aria-hidden className={styles.label}>
          {value === onOption.value ? onOption.label : offOption.label}
        </label>
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
          type='hidden'
          name={name}
          value={typeof value === 'boolean' ? value.toString() : value}
        />
      )}
    </div>
  );
};

export default ToggleInput;
