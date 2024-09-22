import { FieldValues, UseFormSetValue } from 'react-hook-form';
import { DefaultValue, RenderProps } from '../interfaces/FormElements';
import { useEffect } from 'react';

interface UseDefaultValueOptions<TFieldValues extends FieldValues> {
  renderProps: RenderProps<TFieldValues>;
  defaultValue?: DefaultValue<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
}

export default function useDefaultValue<TFieldValues extends FieldValues>({
  renderProps,
  defaultValue,
  setValue,
}: UseDefaultValueOptions<TFieldValues>) {
  const { field, fieldState } = renderProps;
  const { name, value } = field;
  const { isDirty } = fieldState;

  useEffect(() => {
    const update = (value: DefaultValue<TFieldValues>) => {
      setTimeout(() => {
        setValue(name, value);
      });
    };

    if (defaultValue !== undefined && !isDirty) {
      if (Array.isArray(defaultValue)) {
        if (defaultValue?.length && !value?.length) {
          update(defaultValue);
        }
      } else if (defaultValue !== value) {
        update(defaultValue);
      }
    }
  }, [defaultValue, value, isDirty, setValue, name]);
}
