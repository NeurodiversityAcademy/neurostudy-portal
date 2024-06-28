import React, { ReactNode } from 'react';
import { Control, FieldValues } from 'react-hook-form';
import { FormContext } from './formContext';
import classNames from 'classnames';

interface FormProps<TFieldValues extends FieldValues>
  extends React.HTMLAttributes<HTMLFormElement> {
  control: Control<TFieldValues>;
  children: ReactNode;
}

const Form = <TFieldValues extends FieldValues>({
  control,
  children,
  ...rest
}: FormProps<TFieldValues>) => {
  rest.className = classNames(rest.className, 'row');

  return (
    <FormContext.Provider value={{ control: control as Control<FieldValues> }}>
      <form {...rest}>{children}</form>
    </FormContext.Provider>
  );
};

export default Form;
