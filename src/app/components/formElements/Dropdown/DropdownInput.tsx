'use client';

import {
  useState,
  ChangeEvent,
  KeyboardEvent,
  useRef,
  useLayoutEffect,
  FocusEvent,
  KeyboardEventHandler,
} from 'react';
import styles from './dropdown.module.css';
import classNames from 'classnames';
import { FieldValues } from 'react-hook-form';
import CheckBoxItem from '../CheckBoxItem/CheckBoxItem';
import Label from '../Label/Label';
import { PillFocusEventHandler } from '@/app/interfaces/Pill';
import {
  SelectOption,
  DropdownInputProps,
} from '@/app/interfaces/FormElements';
import ErrorBox from '../ErrorBox/ErrorBox';
import Pill from '../Pill/Pill';
import HelperText from '../HelperText/HelperText';
import ClearButton from '../ClearButton/ClearButton';
import useDefaultValue from '@/app/hooks/useDefaultValue';

const DEFAULT_SELECTED_OPTIONS: SelectOption['value'][] = [];
const BUTTON_ARIA_LABEL = 'Clear';

const DropdownInput = <TFieldValues extends FieldValues>({
  name,
  label,
  defaultValue,
  showLabel = false,
  options,
  placeholder,
  helperText,
  required = false,
  onChange,
  renderProps,
  creatable,
  defaultErrorMessage,
  methods,
}: DropdownInputProps<TFieldValues>) => {
  const {
    field,
    formState: { errors },
  } = renderProps;
  const error = errors[name];
  const { disabled, onBlur, value } = field;

  const inputRef = useRef<HTMLInputElement>();
  const nextFocusElemRef = useRef<HTMLElement>();
  const selectedOptions: SelectOption['value'][] =
    value || DEFAULT_SELECTED_OPTIONS;
  const [inputValue, setInputValue] = useState('');

  useDefaultValue<TFieldValues>({
    renderProps,
    defaultValue,
    setValue: methods.setValue,
  });

  const setSelectedOptions = (val: SelectOption['value'][]) => {
    field.onChange(val.length ? val : '');
    onChange?.(val);
  };

  const { getLabel, exists } = (() => {
    const obj: Record<string, SelectOption> = {};
    for (const item of options) {
      obj[item.value.toString()] = item;
    }

    return {
      getLabel: (val: string): SelectOption['label'] =>
        obj[val]?.label || String(val),
      exists: (val: string): boolean => val in obj,
    };
  })();

  const isSelected = (() => {
    const obj: Record<string, true> = {};
    for (const item of selectedOptions) {
      obj[item.toString().toLowerCase()] = true;
    }

    return (val: SelectOption['value']): boolean =>
      val.toString().toLowerCase() in obj;
  })();

  const createItem = (val: string) => {
    if (!creatable) {
      return;
    }
    const valLowerCase = val.toLowerCase();
    setInputValue('');
    !selectedOptions.find(
      (option) => String(option).toLowerCase() === valLowerCase
    ) && setSelectedOptions([...selectedOptions, val]);
    inputRef.current?.focus();
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    key === 'Enter' && e.preventDefault();

    if (inputValue) {
      if (key !== 'Enter') {
        return;
      }

      const inputValueLC = inputValue.toLowerCase();
      const newOption = options.find(
        (option) => option.label.toLowerCase() === inputValueLC
      );
      if (newOption) {
        setInputValue('');
        if (!isSelected(newOption.value)) {
          setSelectedOptions([...selectedOptions, newOption.value]);
        }
      } else if (creatable) {
        createItem(inputValue);
      }
    } else {
      if (key === 'Backspace') {
        const updatedOptions = selectedOptions.slice(0, -1);
        setSelectedOptions(updatedOptions);
      }
    }
  };

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = ({ key }) => {
    key === 'Escape' && (document.activeElement as HTMLElement)?.blur();
  };

  const onRemove = (val: SelectOption['value']) => {
    setSelectedOptions(selectedOptions.filter((item) => item !== val));
  };

  const onPillFocus: PillFocusEventHandler = ({ parent }) => {
    const nextSibling = parent?.nextElementSibling;
    if (!nextSibling) {
      return;
    }

    if (nextSibling === inputRef.current) {
      nextFocusElemRef.current = nextSibling as HTMLInputElement;
    } else {
      const elem = nextSibling.querySelector(
        '*[aria-label="' + BUTTON_ARIA_LABEL + '"]'
      );
      if (elem instanceof HTMLElement) {
        nextFocusElemRef.current = elem;
      }
    }
  };

  useLayoutEffect(() => {
    nextFocusElemRef.current?.focus();
  }, [selectedOptions]);

  const filteredOptions = options.filter((option) => {
    const inputValueLC = inputValue.toLowerCase();
    return option.label.toLowerCase().includes(inputValueLC);
  });

  return (
    <div
      className={classNames(styles.container)}
      aria-disabled={disabled}
      onBlurCapture={(e: FocusEvent<HTMLDivElement, Element>) => {
        !(e.currentTarget as Node)?.contains(e.relatedTarget as Node) &&
          onBlur();
      }}
      onKeyDown={onKeyDown}
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
        className={classNames(styles.inputWrapper, error && styles.error)}
        aria-disabled={disabled}
        onBlurCapture={() => {
          nextFocusElemRef.current = undefined;
        }}
      >
        {selectedOptions.map((option) => (
          <Pill
            key={option.toString()}
            label={getLabel(option.toString())}
            value={option}
            selected
            onClose={onRemove}
            onFocus={onPillFocus}
            disabled={disabled}
            button-aria-label={BUTTON_ARIA_LABEL}
          />
        ))}
        {(!disabled || !selectedOptions.length) && (
          <input
            ref={(node) => {
              inputRef.current = node || undefined;
              field.ref(node);
            }}
            type='text'
            disabled={disabled}
            placeholder={placeholder}
            className={styles.input}
            onChange={onInputChange}
            value={inputValue}
            onKeyDown={onInputKeyDown}
          />
        )}
        <ClearButton
          name={name}
          value={value}
          methods={methods}
          className={styles.clearBtn}
          disabled={disabled}
        />
      </div>
      {!disabled && (
        <div className={styles.dropdownListContainer}>
          <ul className={styles.dropdownList}>
            {creatable &&
              inputValue.trim() &&
              !exists(inputValue) &&
              !isSelected(inputValue) && (
                <CheckBoxItem
                  label={'Add "' + inputValue + '"'}
                  selected={false}
                  onChange={() => createItem(inputValue)}
                  type='pill'
                  role='listitem'
                />
              )}
            {filteredOptions.map(({ label, value }) => (
              <CheckBoxItem
                key={value.toString()}
                label={label}
                selected={isSelected(value)}
                onChange={(selected) => {
                  setSelectedOptions(
                    selected
                      ? [...selectedOptions, value]
                      : selectedOptions.filter((item) => item !== value)
                  );
                }}
                role='listitem'
              />
            ))}
          </ul>
        </div>
      )}
      <HelperText>{helperText}</HelperText>
      {error && (
        <ErrorBox
          message={error.message?.toString() || defaultErrorMessage}
          label={label}
        />
      )}
      {selectedOptions.map((option) => (
        <input
          key={option.toString()}
          type='hidden'
          name={name}
          value={typeof option === 'boolean' ? option.toString() : option}
        />
      ))}
    </div>
  );
};

export default DropdownInput;
