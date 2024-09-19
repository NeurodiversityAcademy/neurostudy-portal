import React, { FocusEvent } from 'react';
import styles from './checkBox.module.css';
import {
  CheckBoxProps,
  SelectOption,
  RenderProps,
} from '@/app/interfaces/FormElements';
import CheckBoxItem from '../CheckBoxItem/CheckBoxItem';
import { FieldValues } from 'react-hook-form';
import Label from '../Label/Label';
import HelperText from '../HelperText/HelperText';
import ErrorBox from '../ErrorBox/ErrorBox';
import classNames from 'classnames';

interface PropType<TFieldValues extends FieldValues>
  extends CheckBoxProps<TFieldValues> {
  renderProps: RenderProps<TFieldValues>;
}

const DEFAULT_SELECTED_OPTIONS: SelectOption['value'][] = [];

const CheckBoxInput = <TFieldValues extends FieldValues>({
  name,
  label,
  showLabel = false,
  options,
  helperText,
  required = false,
  onChange,
  orientation = 'horizontal',
  renderProps,
  defaultErrorMessage,
}: PropType<TFieldValues>) => {
  const {
    field,
    formState: { errors },
  } = renderProps;

  const { disabled, onBlur } = field;

  const error = errors[name];

  const selectedOptions: SelectOption['value'][] =
    field.value || DEFAULT_SELECTED_OPTIONS;

  const setSelectedOptions = (valueArr: SelectOption['value'][]) => {
    const value = valueArr.length ? valueArr : '';
    field.onChange(value);
    onChange?.(valueArr);
  };

  const isSelected = (() => {
    const obj: Record<string, true> = {};
    for (const item of selectedOptions) {
      obj[item.toString().toLowerCase()] = true;
    }

    return (value: SelectOption['value']): boolean =>
      value.toString().toLowerCase() in obj;
  })();

  return (
    <div
      className={styles.checkBoxRoot}
      role='group'
      aria-disabled={disabled}
      onBlurCapture={(e: FocusEvent<HTMLDivElement, Element>) => {
        !(e.currentTarget as Node)?.contains(e.relatedTarget as Node) &&
          onBlur();
      }}
    >
      {showLabel && (
        <Label
          name={name}
          color={error && 'red'}
          label={label}
          required={required}
        />
      )}
      <div
        className={classNames(styles.checkBoxContainer, styles[orientation])}
      >
        {options.map(({ label, value }) => (
          <CheckBoxItem
            key={value.toString()}
            label={label}
            selected={isSelected(label)}
            onChange={(selected) => {
              setSelectedOptions(
                selected
                  ? [...selectedOptions, value]
                  : selectedOptions.filter((item) => item !== value)
              );
            }}
          />
        ))}
      </div>
      <HelperText>{helperText}</HelperText>
      {error && (
        <ErrorBox
          message={error.message?.toString() || defaultErrorMessage}
          label={label}
        />
      )}
      {selectedOptions.map((value) => (
        <input
          key={value.toString()}
          type='hidden'
          name={name}
          value={typeof value === 'boolean' ? value.toString() : value}
        />
      ))}
    </div>
  );
};

export default CheckBoxInput;
