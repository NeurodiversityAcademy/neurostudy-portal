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
import CloseButton from '../../buttons/CloseButton';

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
  const { control, setValue } = useFormContext();

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
        const { value } = field;
        const error = errors[name];

        const inputClassName = classNames(
          styles.input,
          className,
          error && styles.error
        );

        const handleClick = () => {
          setValue(name, '' as TFieldValues[typeof name], {
            shouldValidate: true,
            shouldDirty: true,
          });
        };

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
            <div className={styles.inputWrapper}>
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
              {value?.trim() && <CloseButton onClick={handleClick} />}
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
