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
import CloseButton from '../../buttons/CloseButton';
import HelperText from '../HelperText/HelperText';

interface TextBoxProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  showLabel?: boolean;
  type?: string;
  defaultValue?: PathValue<TFieldValues, Path<TFieldValues>> | undefined;
  required?: boolean;
  placeholder?: string;
  className?: string;
  helperText?: string;
  pattern?: ValidationRule<RegExp>;
  onChange?: ((event: ChangeEvent<HTMLInputElement>) => void) | undefined;
  onBlur?: () => void;
  autoComplete?: string;
  colWidth?: FORM_ELEMENT_COL_WIDTH;
  rules?: Pick<
    RegisterOptions<FieldValues>,
    'maxLength' | 'minLength' | 'validate' | 'required'
  >;
  disabled?: boolean;
}

const TextBox = <TFieldValues extends FieldValues>({
  className,
  name,
  label,
  showLabel = false,
  type = 'text',
  defaultValue = '' as PathValue<TFieldValues, Path<TFieldValues>>,
  placeholder,
  helperText,
  required = false,
  disabled = false,
  pattern,
  onChange,
  onBlur,
  autoComplete,
  colWidth = FORM_ELEMENT_COL_WIDTH.FULL,
  rules: rootRules,
}: TextBoxProps<TFieldValues>) => {
  const { control, setValue, setFocus } = useFormContext();

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
      disabled={disabled}
      render={(props) => {
        const {
          field,
          formState: { errors },
        } = props;
        const { value } = field;
        const error = errors[name];

        const handleClick = () => {
          setValue(name, '' as TFieldValues[typeof name], {
            shouldValidate: true,
            shouldDirty: true,
          });
          setFocus(name);
        };

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
            <div
              className={classNames(styles.inputWrapper, error && styles.error)}
            >
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
              {!disabled && value?.toString().trim() && (
                <CloseButton onClick={handleClick} />
              )}
            </div>
            <HelperText>{helperText}</HelperText>
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
