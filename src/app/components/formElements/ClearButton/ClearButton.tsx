'use client';

import { HTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './clearButton.module.css';
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
import CloseButton from '../../buttons/CloseButton';

interface ClearButtonProps<TFieldValues extends FieldValues>
  extends HTMLAttributes<HTMLButtonElement> {
  className?: string;
  name: Path<TFieldValues>;
  methods: UseFormReturn<TFieldValues>;
  value: PathValue<TFieldValues, Path<TFieldValues>>;
  disabled?: boolean;
}

const ClearButton = <TFieldValues extends FieldValues>({
  className,
  name,
  value,
  methods,
  disabled,
  ...rest
}: ClearButtonProps<TFieldValues>) => {
  return (
    !disabled &&
    !!value?.toString()?.length && (
      <CloseButton
        className={classNames(styles.clearBtn, className)}
        onClick={() => {
          methods.setValue(name, '' as TFieldValues[typeof name], {
            shouldValidate: true,
            shouldDirty: true,
          });
          methods.setFocus(name);
        }}
        {...rest}
      />
    )
  );
};

export default ClearButton;
