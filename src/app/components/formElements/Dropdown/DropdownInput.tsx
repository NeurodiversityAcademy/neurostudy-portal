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
import { ControllerProps, FieldValues, UseFormReturn } from 'react-hook-form';
import CheckBoxItem from '../CheckBoxItem/CheckBoxItem';
import Label from '../Label/Label';
import { PillFocusEventHandler } from '@/app/interfaces/Pill';
import { SelectOption, DropdownProps } from '@/app/interfaces/FormElements';
import ErrorBox from '../ErrorBox/ErrorBox';
import Pill from '../Pill/Pill';
import HelperText from '../HelperText/HelperText';
import CloseButton from '../../buttons/CloseButton';

type RenderProps<TFieldValues extends FieldValues> = Parameters<
  ControllerProps<TFieldValues>['render']
>[0];

interface PropType<TFieldValues extends FieldValues>
  extends DropdownProps<TFieldValues> {
  renderProps: RenderProps<TFieldValues>;
  methods: UseFormReturn<TFieldValues>;
}

const DEFAULT_SELECTED_OPTIONS: SelectOption['value'][] = [];

const DropdownInput = <TFieldValues extends FieldValues>({
  name,
  label,
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
}: PropType<TFieldValues>) => {
  const {
    field,
    formState: { errors },
  } = renderProps;

  const { disabled, onBlur } = field;

  const error = errors[name];

  const inputRef = useRef<HTMLInputElement>();
  const nextFocusElemRef = useRef<HTMLElement>();
  const selectedOptions: SelectOption['value'][] =
    field.value || DEFAULT_SELECTED_OPTIONS;
  const [inputValue, setInputValue] = useState('');

  const setSelectedOptions = (valueArr: SelectOption['value'][]) => {
    const value = valueArr.length ? valueArr : '';
    field.onChange(value);
    onChange?.(valueArr);
  };

  const { getLabel, exists } = (() => {
    const obj: Record<string, SelectOption> = {};
    for (const item of options) {
      obj[item.value.toString()] = item;
    }

    return {
      getLabel: (value: string): SelectOption['label'] =>
        obj[value]?.label || String(value),
      exists: (value: string): boolean => value in obj,
    };
  })();

  const isSelected = (() => {
    const obj: Record<string, true> = {};
    for (const item of selectedOptions) {
      obj[item.toString().toLowerCase()] = true;
    }

    return (value: SelectOption['value']): boolean =>
      value.toString().toLowerCase() in obj;
  })();

  const createItem = (value: string) => {
    if (!creatable) {
      return;
    }
    const valueLC = value.toLowerCase();
    setInputValue('');
    !selectedOptions.find((value) => String(value).toLowerCase() === valueLC) &&
      setSelectedOptions([...selectedOptions, value]);
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

  const onRemove = (value: SelectOption['value']) => {
    const updatedOptions = selectedOptions.filter((item) => item !== value);
    setSelectedOptions(updatedOptions);
  };

  const onPillFocus: PillFocusEventHandler = ({ parent }) => {
    const nextSibling = parent?.nextElementSibling;
    if (!nextSibling) {
      return;
    }

    if (nextSibling === inputRef.current) {
      nextFocusElemRef.current = nextSibling as HTMLInputElement;
    } else {
      const elem = nextSibling.querySelector('*[aria-label="Close"]');
      if (elem instanceof HTMLElement) {
        nextFocusElemRef.current = elem;
      }
    }
  };

  const handleClick = () => {
    methods.setValue(name, '' as TFieldValues[typeof name], {
      shouldValidate: true,
      shouldDirty: true,
    });
    methods.setFocus(name);
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
        onBlurCapture={() => {
          nextFocusElemRef.current = undefined;
        }}
      >
        {selectedOptions.map((value) => (
          <Pill
            key={value.toString()}
            label={getLabel(value.toString())}
            value={value}
            selected
            onClose={onRemove}
            onFocus={onPillFocus}
          />
        ))}
        {(!disabled || !selectedOptions.length) && (
          <input
            ref={(node) => {
              inputRef.current = node || undefined;
              field.ref(node);
            }}
            type='text'
            placeholder={placeholder}
            className={styles.input}
            onChange={onInputChange}
            value={inputValue}
            onKeyDown={onInputKeyDown}
          />
        )}
        {!disabled && !!field.value?.length && (
          <CloseButton onClick={handleClick} />
        )}
      </div>
      {!disabled && (
        <div className={styles.dropdownListContainer}>
          <ul className={styles.dropdownList}>
            {creatable &&
              inputValue &&
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

export default DropdownInput;
