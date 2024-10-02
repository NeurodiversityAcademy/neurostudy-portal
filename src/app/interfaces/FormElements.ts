import { ChangeEvent } from 'react';
import {
  ControllerProps,
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
  ValidationRule,
} from 'react-hook-form';
import { FORM_ELEMENT_COL_WIDTH } from '../utilities/constants';

export type RenderProps<TFieldValues extends FieldValues> = Parameters<
  ControllerProps<TFieldValues>['render']
>[0];

export type DefaultValue<TFieldValues extends FieldValues> = PathValue<
  TFieldValues,
  Path<TFieldValues>
>;

export type DefaultRules<TFieldValues extends FieldValues> = Pick<
  RegisterOptions<TFieldValues>,
  'maxLength' | 'minLength' | 'validate' | 'required'
>;

export interface SelectOption {
  label: string;
  value: string | number | boolean;
}

export interface TextBoxProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  showLabel?: boolean;
  type?: string;
  defaultValue?: DefaultValue<TFieldValues>;
  required?: boolean;
  placeholder?: string;
  className?: string;
  helperText?: string;
  pattern?: ValidationRule<RegExp>;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  autoComplete?: string;
  cols?: FORM_ELEMENT_COL_WIDTH;
  rules?: DefaultRules<TFieldValues>;
  disabled?: boolean;
}

export type TextAreaProps<TFieldValues extends FieldValues> = Omit<
  TextBoxProps<TFieldValues>,
  'pattern' | 'type' | 'onChange'
> & {
  rows?: number;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
};

export interface DropdownProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label?: string;
  showLabel?: boolean;
  options: SelectOption[];
  defaultValue?: DefaultValue<TFieldValues>;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  helperText?: string;
  defaultErrorMessage?: string;
  creatable?: boolean;
  rules?: DefaultRules<TFieldValues>;
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
  'onChange'
> & {
  onChange?: (selected: SelectOption['value']) => void;
};
