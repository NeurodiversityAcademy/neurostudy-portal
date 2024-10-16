'use client';

import React, { ReactNode } from 'react';
import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form';
import classNames from 'classnames';
import styles from './form.module.css';

interface FormProps<TFieldValues extends FieldValues>
  extends React.HTMLAttributes<HTMLFormElement> {
  methods: UseFormReturn<TFieldValues>;
  children: ReactNode;
}

const Form = <TFieldValues extends FieldValues>({
  methods,
  children,
  ...rest
}: FormProps<TFieldValues>) => {
  rest.className = classNames(rest.className, 'row', styles.container);

  return (
    <FormProvider {...methods}>
      <form {...rest}>{children}</form>
    </FormProvider>
  );
};

export default Form;
