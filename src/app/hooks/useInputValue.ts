import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';
import { RenderProps } from '../interfaces/FormElements';
import { useEffect } from 'react';

type DefaultValue = string | number | boolean | string[];

interface UseInputValueOptions<TFieldValues extends FieldValues> {
  renderProps: RenderProps<TFieldValues>;
  defaultValue?: DefaultValue | PathValue<TFieldValues, Path<TFieldValues>>;
}

export default function useInputValue<TFieldValues extends FieldValues>({
  renderProps,
  defaultValue,
}: UseInputValueOptions<TFieldValues>) {
  const { setValue } = useFormContext<TFieldValues>();

  // TEMP
  // name === 'Conditions' &&
  //   console.log(
  //     'defaultValue',
  //     defaultValue,
  //     'value',
  //     field.value,
  //     'isDirty',
  //     renderProps.fieldState.isDirty
  //   );

  const { field, fieldState } = renderProps;
  const { name, value } = field;
  const { isDirty } = fieldState;

  useEffect(() => {
    if (defaultValue !== undefined && !isDirty) {
      // TEMP
      // TODO
      // Different method for arrays
      if (Array.isArray(defaultValue)) {
        if (defaultValue?.length && !value?.length) {
          setValue(name, defaultValue);
        }
      } else if (defaultValue !== value) {
        setValue(name, defaultValue);
      }
    }
  }, [defaultValue, value, isDirty, setValue, name]);
}
