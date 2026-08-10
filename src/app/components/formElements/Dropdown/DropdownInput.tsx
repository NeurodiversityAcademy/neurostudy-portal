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
  useMemo,
} from 'react';
import styles from './dropdown.module.css';
import classNames from 'classnames';
import { FieldValues } from 'react-hook-form';
import CheckBoxItem from '../CheckBoxItem/CheckBoxItem';
import Label from '../Label/Label';
import { PillFocusEventHandler } from '@/app/interfaces/Pill';
import { SelectOption, DropdownInputProps } from '@/app/interfaces/FormElements';
import ErrorBox from '../ErrorBox/ErrorBox';
import Pill from '../Pill/Pill';
import HelperText from '../HelperText/HelperText';
import useDefaultValue from '@/app/hooks/useDefaultValue';
import { emptyFunc } from '@/app/utilities/common';
import DropdownFieldControls from './DropdownFieldControls';
import {
  buildOptionLookup,
  buildSelectedLookup,
  canCreateOption,
  fieldValueFromSelection,
  filterSearchableOptions,
  nextSelectedValues,
  resolveDisplayInputValue,
  toSelectedOptions,
  type SelectValue,
} from './dropdownSelection';

const BUTTON_ARIA_LABEL = 'Clear';

function getComboboxAriaLabel(showLabel: boolean, label?: string): string | undefined {
  return showLabel ? undefined : label || undefined;
}

type DropdownListProps = {
  listId: string;
  multiple: boolean;
  radioMode: boolean;
  isExpanded: boolean;
  hasCreateItem: boolean;
  inputValue: string;
  filteredOptions: SelectOption[];
  isSelected: (val: SelectValue) => boolean;
  onCreate: () => void;
  onToggleOption: (value: SelectValue, selected: boolean) => void;
  onCollapseClearDraft: () => void;
};

function DropdownList({
  listId,
  multiple,
  radioMode,
  isExpanded,
  hasCreateItem,
  inputValue,
  filteredOptions,
  isSelected,
  onCreate,
  onToggleOption,
  onCollapseClearDraft,
}: DropdownListProps) {
  return (
    <div className={styles.dropdownListContainer}>
      <ul
        className={styles.dropdownList}
        id={listId}
        role='listbox'
        aria-multiselectable={multiple}
        onTransitionEnd={(e) => {
          if (e.target === e.currentTarget && !isExpanded) {
            onCollapseClearDraft();
          }
        }}
      >
        {hasCreateItem && (
          <CheckBoxItem
            label={'Add "' + inputValue + '"'}
            checked={false}
            onChange={onCreate}
            type='pill'
            role='option'
          />
        )}
        {filteredOptions.map(({ label, value }) => (
          <CheckBoxItem
            key={String(value)}
            label={label}
            checked={isSelected(value)}
            role='option'
            type={radioMode ? 'radio' : undefined}
            onChange={(selected) => onToggleOption(value, selected)}
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
  );
}

function HiddenSelectedValues({
  name,
  multiple,
  selectedOptions,
}: {
  name: string;
  multiple: boolean;
  selectedOptions: SelectValue[];
}) {
  if (multiple) {
    return selectedOptions.map((option) => (
      <input key={String(option)} type='hidden' name={name} value={String(option)} />
    ));
  }
  if (!selectedOptions.length) {
    return null;
  }
  return <input type='hidden' name={name} value={String(selectedOptions[0])} />;
}

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
  pillsBelow = false,
  closeOnSelect = false,
  showInputAsText = false,
  cols,
  defaultErrorMessage,
  onDraftChange,
  methods,
}: DropdownInputProps<TFieldValues>) => {
  const {
    field,
    formState: { errors },
  } = renderProps;
  const error = errors[name];
  const { disabled, onBlur, value } = field;
  const inputRef = useRef<HTMLInputElement | HTMLSpanElement | undefined>(undefined);
  const nextFocusElemRef = useRef<HTMLElement | undefined>(undefined);
  const selectedOptions = useMemo(() => toSelectedOptions(value), [value]);
  const listId = useId();
  const [expanded, setExpanded] = useState(false);
  const [_inputValue, setInputValue] = useState('');

  useDefaultValue<TFieldValues>({
    renderProps,
    defaultValue,
    setValue: methods.setValue,
  });

  const setSelectedOptions = (val: SelectValue[]) => {
    const cleaned = toSelectedOptions(val);
    field.onChange(fieldValueFromSelection(cleaned, multiple));
    onChange?.(cleaned);
  };

  const { getLabel, exists } = useMemo(() => buildOptionLookup(options), [options]);
  const isSelected = useMemo(() => buildSelectedLookup(selectedOptions), [selectedOptions]);
  const inputValue = resolveDisplayInputValue(multiple, selectedOptions, _inputValue, getLabel);

  const setDraftValue = (next: string) => {
    setInputValue(next);
    onDraftChange?.(next);
  };

  const createItem = (val: string) => {
    const trimmed = val.trim();
    if (!creatable || !trimmed) {
      return;
    }
    setDraftValue('');
    if (!isSelected(trimmed)) {
      setSelectedOptions([...selectedOptions, trimmed]);
    }
    inputRef.current?.focus();
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!searchable) {
      return;
    }
    setDraftValue(e.target.value);
    if (!multiple && selectedOptions.length) {
      setSelectedOptions([]);
    }
  };

  const onRemove = (val: SelectValue) => {
    setSelectedOptions(selectedOptions.filter((item) => item !== val));
  };

  const onPillFocus: PillFocusEventHandler = ({ parent }) => {
    if (parent) {
      nextFocusElemRef.current = parent.nextElementSibling as HTMLElement;
    }
  };

  const selectedPills = selectedOptions.map((option) => (
    <Pill
      key={String(option)}
      label={getLabel(option)}
      value={option}
      selected
      onClose={onRemove}
      onFocus={onPillFocus}
      disabled={disabled}
      button-aria-label={BUTTON_ARIA_LABEL}
    />
  ));

  const hasCreateItem = canCreateOption({
    disabled,
    creatable,
    inputValue,
    exists,
    isSelected,
  });

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && hasCreateItem) {
      createItem(inputValue);
    }
  };

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = ({ key }) => {
    if (key === 'Escape') {
      setExpanded(false);
      inputRef.current?.focus();
    }
  };

  const attachInputRef = (node: HTMLInputElement | HTMLSpanElement | null) => {
    inputRef.current = node || undefined;
    field.ref(node);
  };

  const handleCloseOnSelect = () => {
    if (!closeOnSelect) {
      return;
    }
    setExpanded(false);
    (document.activeElement as HTMLElement)?.blur();
  };

  useLayoutEffect(() => {
    nextFocusElemRef.current?.focus();
  }, [selectedOptions]);

  const isExpanded = Boolean(!disabled && expanded);
  const filteredOptions = filterSearchableOptions(options, inputValue, searchable);

  const focusInput = (e: React.MouseEvent<HTMLElement>) => {
    if (e.currentTarget !== e.target) {
      return;
    }
    if (document.activeElement === inputRef.current) {
      e.preventDefault();
      return;
    }
    setTimeout(() => inputRef.current?.focus());
  };

  return (
    <div
      className={classNames(
        styles.container,
        'border-box-parent',
        cols && 'col-md-' + cols,
        className,
      )}
      role='combobox'
      aria-controls={listId}
      aria-expanded={isExpanded}
      aria-disabled={disabled}
      aria-label={getComboboxAriaLabel(showLabel, label)}
      onFocusCapture={() => !disabled && !expanded && setExpanded(true)}
      onBlurCapture={(e: FocusEvent<HTMLDivElement, Element>) => {
        if (!(e.currentTarget as Node)?.contains(e.relatedTarget as Node)) {
          onBlur();
          setExpanded(false);
        }
      }}
      onKeyDown={onKeyDown}
    >
      {showLabel && <Label name={name} color={error && 'red'} label={label} required={required} />}
      <DropdownFieldControls
        name={name}
        value={value}
        methods={methods}
        error={Boolean(error)}
        pillsBelow={pillsBelow}
        hasInlinePills={!pillsBelow && selectedOptions.length > 0}
        clearable={clearable}
        disabled={disabled}
        searchable={searchable}
        showInputAsText={showInputAsText}
        showTextControl={!disabled || selectedOptions.length === 0}
        placeholder={placeholder}
        inputValue={inputValue}
        inlinePills={multiple && !pillsBelow ? selectedPills : null}
        inputRef={attachInputRef}
        onBlurCapture={() => {
          nextFocusElemRef.current = undefined;
        }}
        onMouseDown={focusInput}
        onInputChange={onInputChange}
        onInputKeyDown={onInputKeyDown}
        onClearDraft={() => {
          setDraftValue('');
        }}
        onToggleExpand={(e) => {
          inputRef.current?.[isExpanded ? 'blur' : 'focus']();
          e.preventDefault();
        }}
      />
      {multiple && pillsBelow && selectedOptions.length > 0 && (
        <div className={styles.selectedPillsBelow} data-testid={`${name}-selected-pills`}>
          {selectedPills}
        </div>
      )}
      <DropdownList
        listId={listId}
        multiple={multiple}
        radioMode={!multiple && radioMode}
        isExpanded={isExpanded}
        hasCreateItem={hasCreateItem}
        inputValue={inputValue}
        filteredOptions={filteredOptions}
        isSelected={isSelected}
        onCreate={() => {
          createItem(inputValue);
          handleCloseOnSelect();
        }}
        onToggleOption={(optionValue, selected) => {
          setSelectedOptions(nextSelectedValues(selectedOptions, optionValue, selected, multiple));
          handleCloseOnSelect();
        }}
        onCollapseClearDraft={() => {
          if (multiple || selectedOptions.length === 0) {
            setDraftValue('');
          }
        }}
      />
      <HelperText>{helperText}</HelperText>
      {error && (
        <ErrorBox message={error.message?.toString() || defaultErrorMessage} label={label} />
      )}
      <HiddenSelectedValues name={name} multiple={multiple} selectedOptions={selectedOptions} />
    </div>
  );
};

export default DropdownInput;
