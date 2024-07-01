'use client';

import { ChangeEvent, ReactNode } from 'react';
import styles from './textarea.module.css';
import Typography, { TypographyVariant } from '../../typography/Typography';
import classNames from 'classnames';
import {
  Controller,
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form';
import { TEXTBOX_COL_WIDTH } from '../TextBox/TextBox';

interface TextAreaProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  showLabel?: boolean;
  defaultValue?: PathValue<TFieldValues, Path<TFieldValues>> | undefined;
  required?: boolean;
  placeholder?: string;
  className?: string;
  rows?: number;
  cols?: TEXTBOX_COL_WIDTH;
  onChange?: ((event: ChangeEvent<HTMLTextAreaElement>) => void) | undefined;
  onBlur?: () => void;
  rules?: Pick<
    RegisterOptions<FieldValues>,
    'maxLength' | 'minLength' | 'validate' | 'required'
  >;
}

const TextArea = <TFieldValues extends FieldValues>({
  name,
  label,
  showLabel = false,
  defaultValue = '' as PathValue<TFieldValues, Path<TFieldValues>>,
  required = false,
  placeholder,
  className,
  rows = 5,
  cols = TEXTBOX_COL_WIDTH.FULL,
  onChange,
  onBlur,
  rules: rootRules,
}: TextAreaProps<TFieldValues>) => {
  const { control } = useFormContext();

  const rules = {
    required,
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
          styles.message,
          className,
          error && styles.error
        );

        return (
          <div
            className={classNames(
              'border-box-parent col-md-' + cols,
              styles.textAreaContainer
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
            <textarea
              placeholder={placeholder}
              className={inputClassName}
              rows={rows}
              cols={cols}
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

export default TextArea;
