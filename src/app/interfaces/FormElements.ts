import {
  ControllerProps,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';

export type RenderProps<TFieldValues extends FieldValues> = Parameters<
  ControllerProps<TFieldValues>['render']
>[0];

export interface SelectOption {
  label: string;
  value: string | number | boolean;
}

export interface DropdownProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label?: string;
  showLabel?: boolean;
  options: SelectOption[];
  defaultValue?: SelectOption['value'][];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  helperText?: string;
  defaultErrorMessage?: string;
  creatable?: boolean;
  rules?: Pick<
    RegisterOptions<TFieldValues>,
    'maxLength' | 'minLength' | 'validate' | 'required'
  >;
  onChange?: (selected: SelectOption['value'][]) => void;
}

export type CheckBoxProps<TFieldValues extends FieldValues> = Omit<
  DropdownProps<TFieldValues>,
  'creatable' | 'placeholder'
> & {
  orientation?: 'horizontal' | 'vertical';
};

export type RadioProps<TFieldValues extends FieldValues> = Omit<
  CheckBoxProps<TFieldValues>,
  'defaultValue' | 'onChange'
> & {
  defaultValue?: SelectOption['value'];
  onChange?: (selected: SelectOption['value']) => void;
};
