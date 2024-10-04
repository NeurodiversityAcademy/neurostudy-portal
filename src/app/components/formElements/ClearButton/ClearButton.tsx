'use client';

import { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './clearButton.module.css';
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
import CloseButton from '../../buttons/CloseButton';

interface ClearButtonProps<TFieldValues extends FieldValues>
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  name: Path<TFieldValues>;
  methods: UseFormReturn<TFieldValues>;
  value: PathValue<TFieldValues, Path<TFieldValues>>;
  disabled?: boolean;
  onClick?: () => void;
}

const ClearButton = <TFieldValues extends FieldValues>({
  className,
  name,
  value,
  methods,
  disabled,
  onClick,
  ...rest
}: ClearButtonProps<TFieldValues>) => {
  return (
    !disabled &&
    !!value?.toString()?.length && (
      <CloseButton
        className={classNames(styles.clearBtn, className)}
        onClick={(e) => {
          methods.setValue(name, '' as TFieldValues[typeof name], {
            shouldValidate: true,
            shouldDirty: true,
          });
          methods.setFocus(name);
          onClick?.(e);
        }}
        aria-label='Clear'
        {...rest}
      />
    )
  );
};

export default ClearButton;
