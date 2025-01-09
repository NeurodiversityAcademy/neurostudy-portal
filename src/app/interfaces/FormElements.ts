import { ChangeEvent } from 'react';
import {
  ControllerProps,
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
  UseFormReturn,
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

export interface BaseInputProps<TFieldValues extends FieldValues> {
  renderProps: RenderProps<TFieldValues>;
  methods: UseFormReturn<TFieldValues>;
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
  readOnly?: boolean;
}

export interface TextBoxInputProps<TFieldValues extends FieldValues>
  extends BaseInputProps<TFieldValues>,
    TextBoxProps<TFieldValues> {}

export type TextAreaProps<TFieldValues extends FieldValues> = Omit<
  TextBoxProps<TFieldValues>,
  'pattern' | 'type' | 'onChange'
> & {
  rows?: number;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
};

export interface TextAreaInputProps<TFieldValues extends FieldValues>
  extends BaseInputProps<TFieldValues>,
    TextAreaProps<TFieldValues> {}

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
  searchable?: boolean;
  clearable?: boolean;
  radioMode?: boolean;
  closeOnSelect?: boolean;
  showInputAsText?: boolean;
  cols?: FORM_ELEMENT_COL_WIDTH;
  multiple?: boolean;
  rules?: DefaultRules<TFieldValues>;
  onChange?: (selected: SelectOption['value'][]) => void;
}

export interface DropdownInputProps<TFieldValues extends FieldValues>
  extends BaseInputProps<TFieldValues>,
    DropdownProps<TFieldValues> {}

export type CheckBoxProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label?: string;
  showLabel?: boolean;
  options: SelectOption[];
  defaultValue?: DefaultValue<TFieldValues>;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helperText?: string;
  defaultErrorMessage?: string;
  cols?: FORM_ELEMENT_COL_WIDTH;
  multiple?: boolean;
  rules?: DefaultRules<TFieldValues>;
  onChange?: (selected: SelectOption['value'][]) => void;
  orientation?: 'horizontal' | 'vertical';
};

export interface CheckBoxInputProps<TFieldValues extends FieldValues>
  extends BaseInputProps<TFieldValues>,
    CheckBoxProps<TFieldValues> {}

export type RadioProps<TFieldValues extends FieldValues> = Omit<
  CheckBoxProps<TFieldValues>,
  'onChange'
> & {
  onChange?: (selected: SelectOption['value']) => void;
};

export interface RadioInputProps<TFieldValues extends FieldValues>
  extends BaseInputProps<TFieldValues>,
    RadioProps<TFieldValues> {}

export type ToggleProps<TFieldValues extends FieldValues> = Omit<
  RadioProps<TFieldValues>,
  'options' | 'orientation'
> & {
  options?: {
    on: string | SelectOption;
    off: string | SelectOption;
  };
};

export interface ToggleInputProps<TFieldValues extends FieldValues>
  extends BaseInputProps<TFieldValues>,
    ToggleProps<TFieldValues> {}

export type SliderProps<TFieldValues extends FieldValues> = Omit<
  TextBoxProps<TFieldValues>,
  'type' | 'required' | 'placeholder' | 'autoComplete' | 'onChange'
> & {
  min?: number;
  max?: number;
  step?: number;
  defaultErrorMessage?: string;
  onChange?: (selected: number) => void;
};

export interface SliderInputProps<TFieldValues extends FieldValues>
  extends BaseInputProps<TFieldValues>,
    SliderProps<TFieldValues> {
  min: number;
  max: number;
  step: number;
}
