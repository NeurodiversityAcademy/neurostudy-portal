'use client';

import { ChangeEvent } from 'react';
import styles from './textBox.module.css';
import classNames from 'classnames';
import {
  Controller,
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
  ValidationRule,
  useFormContext,
} from 'react-hook-form';
import Label from '../Label/Label';
import ErrorBox from '../ErrorBox/ErrorBox';
import { FORM_ELEMENT_COL_WIDTH } from '@/app/utilities/constants';

interface TextBoxProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  showLabel?: boolean;
  type?: string;
  defaultValue?: PathValue<TFieldValues, Path<TFieldValues>> | undefined;
  required?: boolean;
  placeholder?: string;
  className?: string;
  pattern?: ValidationRule<RegExp>;
  onChange?: ((event: ChangeEvent<HTMLInputElement>) => void) | undefined;
  onBlur?: () => void;
  autoComplete?: string;
  colWidth?: FORM_ELEMENT_COL_WIDTH;
  rules?: Pick<
    RegisterOptions<FieldValues>,
    'maxLength' | 'minLength' | 'validate' | 'required'
  >;
}

const TextBox = <TFieldValues extends FieldValues>({
  className,
  name,
  label,
  showLabel = false,
  type = 'text',
  defaultValue = '' as PathValue<TFieldValues, Path<TFieldValues>>,
  placeholder,
  required = false,
  pattern,
  onChange,
  onBlur,
  autoComplete,
  colWidth = FORM_ELEMENT_COL_WIDTH.FULL,
  rules: rootRules,
}: TextBoxProps<TFieldValues>) => {
  const { control } = useFormContext();

  const rules = {
    required,
    pattern,
    ...rootRules,
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={rules}
      render={(props) => {
        const {
          field,
          formState: { errors },
        } = props;

        const error = errors[name];

        const inputClassName = classNames(
          styles.input,
          className,
          error && 'error'
        );

        return (
          <div
            className={classNames(
              'border-box-parent col-md-' + colWidth,
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
            <input
              type={type}
              placeholder={placeholder}
              className={inputClassName}
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
            {error && (
              <ErrorBox message={error.message?.toString()} label={label} />
            )}
          </div>
        );
      }}
    />
  );
};

export default TextBox;
