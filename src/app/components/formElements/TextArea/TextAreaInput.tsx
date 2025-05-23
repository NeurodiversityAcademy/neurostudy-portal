'use client';

import styles from './textarea.module.css';
import classNames from 'classnames';
import { FieldValues } from 'react-hook-form';
import Label from '../Label/Label';
import { TextAreaInputProps } from '@/app/interfaces/FormElements';
import ErrorBox from '../ErrorBox/ErrorBox';
import ClearButton from '../ClearButton/ClearButton';
import useDefaultValue from '@/app/hooks/useDefaultValue';
import HelperText from '../HelperText/HelperText';

const TextAreaInput = <TFieldValues extends FieldValues>({
  name,
  label,
  defaultValue,
  className,
  showLabel = false,
  placeholder,
  helperText,
  required = false,
  disabled,
  onChange,
  onBlur,
  rows = 5,
  cols,
  renderProps,
  methods,
}: TextAreaInputProps<TFieldValues>) => {
  const {
    field,
    formState: { errors },
  } = renderProps;
  const { value } = field;
  const error = errors[name];

  useDefaultValue<TFieldValues>({
    renderProps,
    defaultValue,
    setValue: methods.setValue,
  });

  return (
    <div
      className={classNames(
        'border-box-parent col-md-' + cols,
        styles.container
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
        className={classNames(styles.inputWrapper, error && styles.error)}
        aria-disabled={disabled}
      >
        <textarea
          placeholder={placeholder}
          className={classNames(styles.input, className)}
          rows={rows}
          cols={cols}
          disabled={disabled}
          {...field}
          onChange={function (this: HTMLTextAreaElement, ...args) {
            field.onChange.apply(this, args);
            onChange?.apply(this, args);
          }}
          onBlur={function (this: HTMLTextAreaElement) {
            field.onBlur.apply(this);
            onBlur?.apply(this);
          }}
        />
        <ClearButton<TFieldValues>
          methods={methods}
          name={name}
          value={value}
          className={styles.clearBtn}
          disabled={disabled}
        />
      </div>
      <HelperText>{helperText}</HelperText>
      {error && <ErrorBox message={error.message?.toString()} label={label} />}
    </div>
  );
};

export default TextAreaInput;
