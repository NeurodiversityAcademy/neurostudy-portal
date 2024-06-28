import { createContext, useContext } from 'react';
import { Control, FieldValues } from 'react-hook-form';

export interface FormContent<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
}

export const FormContext = createContext<FormContent<FieldValues> | undefined>(
  undefined
);

export const useFormContext = <TFieldValues extends FieldValues>() => {
  const context = useContext(
    FormContext as React.Context<FormContent<TFieldValues> | undefined>
  );
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
