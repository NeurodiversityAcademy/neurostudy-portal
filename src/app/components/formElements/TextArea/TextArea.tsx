'use client';

import { ChangeEvent } from 'react';
import styles from './textarea.module.css';
import classNames from 'classnames';
import {
  Controller,
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form';
import Label from '../Label/Label';
import ErrorBox from '../ErrorBox/ErrorBox';
import { FORM_ELEMENT_COL_WIDTH } from '@/app/utilities/constants';
import ClearButton from '../ClearButton/ClearButton';

interface TextAreaProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  showLabel?: boolean;
  defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>;
  required?: boolean;
  placeholder?: string;
  className?: string;
  rows?: number;
  cols?: FORM_ELEMENT_COL_WIDTH;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
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
  cols = FORM_ELEMENT_COL_WIDTH.FULL,
  onChange,
  onBlur,
  rules: rootRules,
}: TextAreaProps<TFieldValues>) => {
  const methods = useFormContext<TFieldValues>();

  const rules = {
    required,
    ...rootRules,
  };

  return (
    <Controller
      control={methods.control}
      name={name}
      defaultValue={defaultValue}
      rules={rules}
      render={(props) => {
        const {
          field,
          formState: { errors },
        } = props;
        const { value } = field;
        const error = errors[name];

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
            >
              <textarea
                placeholder={placeholder}
                className={classNames(styles.input, className)}
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
              <ClearButton<TFieldValues>
                methods={methods}
                name={name}
                value={value}
                className={styles.clearBtn}
              />
            </div>
            {error && (
              <ErrorBox message={error.message?.toString()} label={label} />
            )}
          </div>
        );
      }}
    />
  );
};

export default TextArea;
