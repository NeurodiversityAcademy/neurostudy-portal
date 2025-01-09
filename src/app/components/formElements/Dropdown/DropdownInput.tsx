'use client';

import {
  useState,
  ChangeEvent,
  KeyboardEvent,
  useRef,
  useLayoutEffect,
  FocusEvent,
  KeyboardEventHandler,
  useId,
  useEffect,
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
import { emptyFunc } from '@/app/utilities/common';
import ArrowDownIcon from '../../images/ArrowDown';

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
  className,
  renderProps,
  creatable,
  searchable = true,
  clearable = true,
  radioMode = false,
  multiple = false,
  closeOnSelect = false,
  showInputAsText = false,
  cols,
  defaultErrorMessage,
  methods,
}: DropdownInputProps<TFieldValues>) => {
  const {
    field,
    formState: { errors },
  } = renderProps;
  const error = errors[name];
  const { disabled, onBlur, value } = field;

  const inputRef = useRef<HTMLInputElement | HTMLSpanElement>();
  const nextFocusElemRef = useRef<HTMLElement>();
  const selectedOptions: SelectOption['value'][] =
    value || DEFAULT_SELECTED_OPTIONS;
  const listId = useId();
  const [expanded, setExpanded] = useState(false);

  radioMode = !multiple && radioMode;

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

  const [_inputValue, setInputValue] = useState('');
  const inputValue =
    !multiple && selectedOptions.length
      ? getLabel(selectedOptions[0].toString())
      : _inputValue;

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
    const option = selectedOptions.find(
      (option) => String(option).toLowerCase() === valLowerCase
    );
    !option && setSelectedOptions([...selectedOptions, val]);
    inputRef.current?.focus();
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!searchable) {
      return;
    }
    setInputValue(e.target.value);
    !multiple && selectedOptions.length && setSelectedOptions([]);
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
        if (!isSelected(newOption.value)) {
          setSelectedOptions([...selectedOptions, newOption.value]);
        }
        setInputValue('');
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

  const attachInputRef = (node: HTMLInputElement | HTMLSpanElement | null) => {
    inputRef.current = node || undefined;
    field.ref(node);
  };

  const handleCloseOnSelect = () => {
    if (closeOnSelect) {
      setExpanded(false);
      (document.activeElement as HTMLElement)?.blur();
    }
  };

  useLayoutEffect(() => {
    nextFocusElemRef.current?.focus();
  }, [selectedOptions]);

  useEffect(() => {
    disabled && setExpanded(false);
  }, [disabled]);

  const filteredOptions = searchable
    ? options.filter((option) => {
        const inputValueLC = inputValue.toLowerCase();
        return option.label.toLowerCase().includes(inputValueLC);
      })
    : options;

  const focusInput = (e: React.MouseEvent<HTMLElement>) => {
    if (e.currentTarget === e.target) {
      if (document.activeElement === inputRef.current) {
        e.preventDefault();
      } else {
        setTimeout(() => inputRef.current?.focus());
      }
    }
  };

  const hasCreateItem =
    !disabled &&
    creatable &&
    inputValue.trim() &&
    !exists(inputValue) &&
    !isSelected(inputValue);

  return (
    <div
      className={classNames(
        styles.container,
        'border-box-parent',
        cols && 'col-md-' + cols,
        className
      )}
      role='combobox'
      aria-controls={listId}
      aria-expanded={expanded}
      aria-disabled={disabled}
      onFocusCapture={() => !expanded && setExpanded(true)}
      onBlurCapture={(e: FocusEvent<HTMLDivElement, Element>) => {
        if (!(e.currentTarget as Node)?.contains(e.relatedTarget as Node)) {
          onBlur();
          setExpanded(false);
        }
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
        className={classNames(
          styles.inputWrapper,
          error && styles.error,
          // NOTE: Exposing for CSS Selectors
          'dropdown-input-wrapper'
        )}
        onBlurCapture={() => {
          nextFocusElemRef.current = undefined;
        }}
        onMouseDown={focusInput}
      >
        <div
          className={classNames(
            styles.pillAndInput,
            selectedOptions.length && styles.hasValue
          )}
          onMouseDown={focusInput}
        >
          {multiple &&
            selectedOptions.map((option) => (
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
          {(!disabled || !selectedOptions.length) &&
            (showInputAsText ? (
              <span
                ref={attachInputRef}
                className={styles.inputAsText}
                tabIndex={0}
              >
                {inputValue}
              </span>
            ) : (
              <input
                ref={attachInputRef}
                type='text'
                role={searchable ? 'searchbox' : undefined}
                disabled={disabled}
                placeholder={placeholder}
                className={styles.input}
                onChange={onInputChange}
                value={inputValue}
                onKeyDown={onInputKeyDown}
                readOnly={!searchable}
              />
            ))}
        </div>
        {clearable && (
          <ClearButton
            name={name}
            value={value}
            methods={methods}
            className={styles.clearBtn}
            disabled={disabled}
            onClick={() => !multiple && setInputValue('')}
          />
        )}
        <ArrowDownIcon
          aria-hidden
          className={styles.expandIcon}
          onMouseDown={(e) => {
            inputRef.current?.[expanded ? 'blur' : 'focus']();
            e.preventDefault();
          }}
        />
      </div>
      <div className={styles.dropdownListContainer}>
        <ul
          className={styles.dropdownList}
          id={listId}
          role='listbox'
          aria-multiselectable={multiple}
          onTransitionEnd={(e) => {
            e.target === e.currentTarget &&
              !expanded &&
              (multiple || !selectedOptions.length) &&
              setInputValue('');
          }}
        >
          {hasCreateItem && (
            <CheckBoxItem
              label={'Add "' + inputValue + '"'}
              checked={false}
              onChange={() => {
                createItem(inputValue);
                handleCloseOnSelect();
              }}
              type='pill'
              role='option'
            />
          )}
          {filteredOptions.map(({ label, value }) => (
            <CheckBoxItem
              key={value.toString()}
              label={label}
              checked={isSelected(value)}
              role='option'
              type={radioMode ? 'radio' : undefined}
              onChange={(selected) => {
                if (multiple) {
                  setSelectedOptions(
                    selected
                      ? [...selectedOptions, value]
                      : selectedOptions.filter((item) => item !== value)
                  );
                } else {
                  setSelectedOptions(selected ? [value] : []);
                }

                handleCloseOnSelect();
              }}
            />
          ))}
          {!hasCreateItem && !filteredOptions.length && (
            <CheckBoxItem
              type='pill'
              label='No options'
              checked={false}
              role='option'
              aria-disabled
              onChange={emptyFunc}
              className={styles.noOptionItem}
              tabIndex={-1}
            />
          )}
        </ul>
      </div>
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
