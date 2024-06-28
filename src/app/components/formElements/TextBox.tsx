'use client';

import { ChangeEvent, ReactNode } from 'react';
import styles from './textBox.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';
import classNames from 'classnames';
import {
  Controller,
  FieldValues,
  Path,
  PathValue,
  ValidationRule,
} from 'react-hook-form';
import { useFormContext } from './formContext';

export enum TEXTBOX_COL_WIDTH {
  SMALLER = 3,
  SMALL = 4,
  HALF = 6,
  FULL = 12,
}

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
  colWidth?: TEXTBOX_COL_WIDTH;
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
  colWidth = TEXTBOX_COL_WIDTH.FULL,
}: TextBoxProps<TFieldValues>) => {
  const { control } = useFormContext();

  const rules = {
    required,
    pattern,
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
          error && styles.error
        );

        return (
          <div
            className={classNames(
              'border-box-parent col-md-' + colWidth,
              styles.container
            )}
          >
            {showLabel && (
              <label htmlFor={name} className={styles.label}>
                <Typography
                  variant={TypographyVariant.Body2}
                  color={error && 'red'}
                >
                  {label}
                  {required && '* '}
                  {required && (
                    <Typography
                      variant={TypographyVariant.LABELtext}
                      color='var(--grey)'
                    >
                      (required)
                    </Typography>
                  )}
                </Typography>
              </label>
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
              <small className={styles.errorMessage}>
                {(error.message || `${label} is invalid.`) as ReactNode}
              </small>
            )}
          </div>
        );
      }}
    />
  );
};

export default TextBox;
