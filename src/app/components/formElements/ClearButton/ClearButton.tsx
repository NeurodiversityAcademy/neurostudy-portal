'use client';

import { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './clearButton.module.css';
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
import CloseButton from '../../buttons/CloseButton';

interface ClearButtonProps<
  TFieldValues extends FieldValues,
> extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  name: Path<TFieldValues>;
  methods: UseFormReturn<TFieldValues>;
  value: PathValue<TFieldValues, Path<TFieldValues>>;
  disabled?: boolean;
  /** When true, show even if `value` is empty (e.g. typed draft text). */
  forceVisible?: boolean;
}

function hasClearableValue(value: unknown): boolean {
  if (value == null) {
    return false;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return String(value).length > 0;
}

function emptyFieldValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return [];
  }
  return '';
}

const ClearButton = <TFieldValues extends FieldValues>({
  className,
  name,
  value,
  methods,
  disabled,
  forceVisible = false,
  onClick,
  ...rest
}: ClearButtonProps<TFieldValues>) => {
  const visible = !disabled && (forceVisible || hasClearableValue(value));
  if (!visible) {
    return null;
  }

  return (
    <CloseButton
      className={classNames(styles.clearBtn, className)}
      onClick={(e) => {
        methods.setValue(
          name,
          emptyFieldValue(value) as PathValue<TFieldValues, Path<TFieldValues>>,
          {
            shouldValidate: true,
            shouldDirty: true,
          },
        );
        methods.setFocus(name);
        onClick?.(e);
      }}
      aria-label='Clear'
      {...rest}
    />
  );
};

export default ClearButton;
