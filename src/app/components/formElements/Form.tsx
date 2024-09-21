'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form';
import classNames from 'classnames';
import styles from './form.module.css';

interface FormProps<TFieldValues extends FieldValues>
  extends React.HTMLAttributes<HTMLFormElement> {
  initialized?: boolean;
  methods: UseFormReturn<TFieldValues>;
  children: ReactNode;
}

const Form = <TFieldValues extends FieldValues>({
  initialized: _initialized = true,
  methods,
  children,
  ...rest
}: FormProps<TFieldValues>) => {
  const [initialized, setInitialized] = useState(_initialized);

  useEffect(() => {
    if (_initialized && !initialized) {
      methods.reset();
      setInitialized(_initialized);
    }
  }, [methods, initialized, _initialized]);

  rest.className = classNames(rest.className, 'row', styles.container);

  return (
    <FormProvider key={initialized ? 'initialized' : 'loading'} {...methods}>
      <form {...rest}>{children}</form>
    </FormProvider>
  );
};

export default Form;
