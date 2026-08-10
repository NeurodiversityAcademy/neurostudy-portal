'use client';

import {
  useState,
  ChangeEvent,
  KeyboardEvent,
  useRef,
  useLayoutEffect,
  KeyboardEventHandler,
  useMemo,
} from 'react';
import { FieldValues, Path } from 'react-hook-form';
import { PillFocusEventHandler } from '@/app/interfaces/Pill';
import { DropdownInputProps } from '@/app/interfaces/FormElements';
import useDefaultValue from '@/app/hooks/useDefaultValue';
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

type UseDropdownInputStateParams<TFieldValues extends FieldValues> = Pick<
  DropdownInputProps<TFieldValues>,
  | 'name'
  | 'defaultValue'
  | 'options'
  | 'onChange'
  | 'renderProps'
  | 'creatable'
  | 'searchable'
  | 'multiple'
  | 'closeOnSelect'
  | 'onDraftChange'
  | 'methods'
>;

function boolProp(value: boolean | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }
  return value;
}

export function useDropdownInputState<TFieldValues extends FieldValues>(
  params: UseDropdownInputStateParams<TFieldValues>,
) {
  const name = params.name;
  const defaultValue = params.defaultValue;
  const options = params.options;
  const onChange = params.onChange;
  const renderProps = params.renderProps;
  const creatable = params.creatable;
  const searchable = boolProp(params.searchable, true);
  const multiple = boolProp(params.multiple, false);
  const closeOnSelect = boolProp(params.closeOnSelect, false);
  const onDraftChange = params.onDraftChange;
  const methods = params.methods;
  const {
    field,
    formState: { errors },
  } = renderProps;
  const error = errors[name as Path<TFieldValues>];
  const { disabled, onBlur, value } = field;
  const inputRef = useRef<HTMLInputElement | HTMLSpanElement | undefined>(undefined);
  const nextFocusElemRef = useRef<HTMLElement | undefined>(undefined);
  const selectedOptions = useMemo(() => toSelectedOptions(value), [value]);
  const [expanded, setExpanded] = useState(false);
  const [draftValue, setDraftValueState] = useState('');

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
  const inputValue = resolveDisplayInputValue(multiple, selectedOptions, draftValue, getLabel);

  const setDraftValue = (next: string) => {
    setDraftValueState(next);
    onDraftChange?.(next);
  };

  const createItem = (val: string) => {
    const trimmed = val.trim();
    if (!creatable) {
      return;
    }
    if (!trimmed) {
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
    if (multiple) {
      return;
    }
    if (selectedOptions.length === 0) {
      return;
    }
    setSelectedOptions([]);
  };

  const onRemove = (val: SelectValue) => {
    setSelectedOptions(selectedOptions.filter((item) => item !== val));
  };

  const onPillFocus: PillFocusEventHandler = ({ parent }) => {
    if (parent) {
      nextFocusElemRef.current = parent.nextElementSibling as HTMLElement;
    }
  };

  const hasCreateItem = canCreateOption({
    disabled,
    creatable,
    inputValue,
    exists,
    isSelected,
  });

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }
    if (!hasCreateItem) {
      return;
    }
    createItem(inputValue);
  };

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = ({ key }) => {
    if (key !== 'Escape') {
      return;
    }
    setExpanded(false);
    inputRef.current?.focus();
  };

  const attachInputRef = (node: HTMLInputElement | HTMLSpanElement | null) => {
    if (node) {
      inputRef.current = node;
    } else {
      inputRef.current = undefined;
    }
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

  const isExpanded = Boolean(disabled ? false : expanded);
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

  const expandIfEnabled = () => {
    if (disabled) {
      return;
    }
    if (expanded) {
      return;
    }
    setExpanded(true);
  };

  const collapseIfLeaving = (relatedTarget: EventTarget | null, currentTarget: EventTarget) => {
    const stillInside = (currentTarget as Node).contains(relatedTarget as Node);
    if (stillInside) {
      return;
    }
    onBlur();
    setExpanded(false);
  };

  const toggleOption = (optionValue: SelectValue, selected: boolean) => {
    setSelectedOptions(nextSelectedValues(selectedOptions, optionValue, selected, multiple));
    handleCloseOnSelect();
  };

  const createFromInput = () => {
    createItem(inputValue);
    handleCloseOnSelect();
  };

  const clearDraftOnCollapse = () => {
    if (multiple) {
      setDraftValue('');
      return;
    }
    if (selectedOptions.length === 0) {
      setDraftValue('');
    }
  };

  const toggleExpand = (e: React.MouseEvent) => {
    const input = inputRef.current;
    if (input) {
      if (isExpanded) {
        input.blur();
      } else {
        input.focus();
      }
    }
    e.preventDefault();
  };

  return {
    error,
    disabled,
    value,
    selectedOptions,
    getLabel,
    isSelected,
    inputValue,
    isExpanded,
    filteredOptions,
    hasCreateItem,
    inputRef,
    nextFocusElemRef,
    setDraftValue,
    onRemove,
    onPillFocus,
    onInputChange,
    onInputKeyDown,
    onKeyDown,
    attachInputRef,
    focusInput,
    expandIfEnabled,
    collapseIfLeaving,
    toggleOption,
    createFromInput,
    clearDraftOnCollapse,
    toggleExpand,
  };
}

export type DropdownInputState = ReturnType<typeof useDropdownInputState>;

export type { SelectValue };
