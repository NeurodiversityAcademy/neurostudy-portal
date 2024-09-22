'use client';

import styles from './textBox.module.css';
import classNames from 'classnames';
import { ControllerProps, FieldValues, UseFormReturn } from 'react-hook-form';
import Label from '../Label/Label';
import { TextBoxProps } from '@/app/interfaces/FormElements';
import ErrorBox from '../ErrorBox/ErrorBox';
import HelperText from '../HelperText/HelperText';
import ClearButton from '../ClearButton/ClearButton';
import useDefaultValue from '@/app/hooks/useDefaultValue';

type RenderProps<TFieldValues extends FieldValues> = Parameters<
  ControllerProps<TFieldValues>['render']
>[0];

interface PropType<TFieldValues extends FieldValues>
  extends TextBoxProps<TFieldValues> {
  renderProps: RenderProps<TFieldValues>;
  methods: UseFormReturn<TFieldValues>;
}

const TextBoxInput = <TFieldValues extends FieldValues>({
  type = 'text',
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
  autoComplete,
  cols,
  renderProps,
  methods,
}: PropType<TFieldValues>) => {
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
      <div className={classNames(styles.inputWrapper, error && styles.error)}>
        <input
          type={type}
          placeholder={placeholder}
          className={classNames(styles.input, className)}
          autoComplete={autoComplete}
          {...field}
          onChange={function (this: HTMLInputElement, ...args) {
            field.onChange.apply(this, args);
            onChange?.apply(this, args);
          }}
          onBlur={function (this: HTMLInputElement) {
            field.onBlur.apply(this);
            onBlur?.apply(this);
          }}
        />
        <ClearButton<TFieldValues>
          methods={methods}
          name={name}
          value={value}
          disabled={disabled}
        />
      </div>
      <HelperText>{helperText}</HelperText>
      {error && <ErrorBox message={error.message?.toString()} label={label} />}
    </div>
  );
};

export default TextBoxInput;
