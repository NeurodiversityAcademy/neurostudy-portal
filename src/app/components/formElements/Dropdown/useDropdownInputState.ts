'use client';

import {
  useState,
  ChangeEvent,
  KeyboardEvent,
  useRef,
  useLayoutEffect,
  KeyboardEventHandler,
  useMemo,
  MutableRefObject,
} from 'react';
import { FieldValues, Path, RefCallBack } from 'react-hook-form';
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

type DropdownCore<TFieldValues extends FieldValues> = {
  params: UseDropdownInputStateParams<TFieldValues>;
  searchable: boolean;
  multiple: boolean;
  closeOnSelect: boolean;
  error: unknown;
  disabled?: boolean;
  onBlur: () => void;
  value: unknown;
  fieldRef: RefCallBack;
  selectedOptions: SelectValue[];
  getLabel: (val: SelectValue) => string;
  isSelected: (val: SelectValue) => boolean;
  exists: (val: SelectValue) => boolean;
  inputValue: string;
  isExpanded: boolean;
  filteredOptions: ReturnType<typeof filterSearchableOptions>;
  hasCreateItem: boolean;
  expanded: boolean;
  setExpanded: (next: boolean) => void;
  setDraftValue: (next: string) => void;
  setSelectedOptions: (val: SelectValue[]) => void;
  inputRef: MutableRefObject<HTMLInputElement | HTMLSpanElement | undefined>;
  nextFocusElemRef: MutableRefObject<HTMLElement | undefined>;
};

function useDropdownCore<TFieldValues extends FieldValues>(
  params: UseDropdownInputStateParams<TFieldValues>,
): DropdownCore<TFieldValues> {
  const searchable = boolProp(params.searchable, true);
  const multiple = boolProp(params.multiple, false);
  const closeOnSelect = boolProp(params.closeOnSelect, false);
  const {
    field,
    formState: { errors },
  } = params.renderProps;
  const error = errors[params.name as Path<TFieldValues>];
  const { disabled, onBlur, value } = field;
  const inputRef = useRef<HTMLInputElement | HTMLSpanElement | undefined>(undefined);
  const nextFocusElemRef = useRef<HTMLElement | undefined>(undefined);
  const selectedOptions = useMemo(() => toSelectedOptions(value), [value]);
  const [expanded, setExpanded] = useState(false);
  const [draftValue, setDraftValueState] = useState('');

  useDefaultValue<TFieldValues>({
    renderProps: params.renderProps,
    defaultValue: params.defaultValue,
    setValue: params.methods.setValue,
  });

  const setSelectedOptions = (val: SelectValue[]) => {
    const cleaned = toSelectedOptions(val);
    field.onChange(fieldValueFromSelection(cleaned, multiple));
    params.onChange?.(cleaned);
  };

  const { getLabel, exists } = useMemo(() => buildOptionLookup(params.options), [params.options]);
  const isSelected = useMemo(() => buildSelectedLookup(selectedOptions), [selectedOptions]);
  const inputValue = resolveDisplayInputValue(multiple, selectedOptions, draftValue, getLabel);
  const setDraftValue = (next: string) => {
    setDraftValueState(next);
    params.onDraftChange?.(next);
  };
  const isExpanded = Boolean(disabled ? false : expanded);
  const filteredOptions = filterSearchableOptions(params.options, inputValue, searchable);
  const hasCreateItem = canCreateOption({
    disabled,
    creatable: params.creatable,
    inputValue,
    exists,
    isSelected,
  });

  useLayoutEffect(() => {
    nextFocusElemRef.current?.focus();
  }, [selectedOptions]);

  return {
    params,
    searchable,
    multiple,
    closeOnSelect,
    error,
    disabled,
    onBlur,
    value,
    fieldRef: field.ref,
    selectedOptions,
    getLabel,
    isSelected,
    exists,
    inputValue,
    isExpanded,
    filteredOptions,
    hasCreateItem,
    expanded,
    setExpanded,
    setDraftValue,
    setSelectedOptions,
    inputRef,
    nextFocusElemRef,
  };
}

function useDropdownHandlers<TFieldValues extends FieldValues>(core: DropdownCore<TFieldValues>) {
  const createItem = (val: string) => {
    const trimmed = val.trim();
    if (!core.params.creatable) {
      return;
    }
    if (!trimmed) {
      return;
    }
    core.setDraftValue('');
    if (!core.isSelected(trimmed)) {
      core.setSelectedOptions([...core.selectedOptions, trimmed]);
    }
    core.inputRef.current?.focus();
  };

  const handleCloseOnSelect = () => {
    if (!core.closeOnSelect) {
      return;
    }
    core.setExpanded(false);
    (document.activeElement as HTMLElement)?.blur();
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!core.searchable) {
      return;
    }
    core.setDraftValue(e.target.value);
    if (core.multiple) {
      return;
    }
    if (core.selectedOptions.length === 0) {
      return;
    }
    core.setSelectedOptions([]);
  };

  const onRemove = (val: SelectValue) => {
    core.setSelectedOptions(core.selectedOptions.filter((item) => item !== val));
  };

  const onPillFocus: PillFocusEventHandler = ({ parent }) => {
    if (parent) {
      core.nextFocusElemRef.current = parent.nextElementSibling as HTMLElement;
    }
  };

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }
    if (!core.hasCreateItem) {
      return;
    }
    createItem(core.inputValue);
  };

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = ({ key }) => {
    if (key !== 'Escape') {
      return;
    }
    core.setExpanded(false);
    core.inputRef.current?.focus();
  };

  const attachInputRef = (node: HTMLInputElement | HTMLSpanElement | null) => {
    if (node) {
      core.inputRef.current = node;
    } else {
      core.inputRef.current = undefined;
    }
    core.fieldRef(node);
  };

  const focusInput = (e: React.MouseEvent<HTMLElement>) => {
    if (e.currentTarget !== e.target) {
      return;
    }
    if (document.activeElement === core.inputRef.current) {
      e.preventDefault();
      return;
    }
    setTimeout(() => core.inputRef.current?.focus());
  };

  const expandIfEnabled = () => {
    if (core.disabled) {
      return;
    }
    if (core.expanded) {
      return;
    }
    core.setExpanded(true);
  };

  const collapseIfLeaving = (relatedTarget: EventTarget | null, currentTarget: EventTarget) => {
    const stillInside = (currentTarget as Node).contains(relatedTarget as Node);
    if (stillInside) {
      return;
    }
    core.onBlur();
    core.setExpanded(false);
  };

  const toggleOption = (optionValue: SelectValue, selected: boolean) => {
    core.setSelectedOptions(
      nextSelectedValues(core.selectedOptions, optionValue, selected, core.multiple),
    );
    handleCloseOnSelect();
  };

  const createFromInput = () => {
    createItem(core.inputValue);
    handleCloseOnSelect();
  };

  const clearDraftOnCollapse = () => {
    if (core.multiple) {
      core.setDraftValue('');
      return;
    }
    if (core.selectedOptions.length === 0) {
      core.setDraftValue('');
    }
  };

  const toggleExpand = (e: React.MouseEvent) => {
    const input = core.inputRef.current;
    if (input) {
      if (core.isExpanded) {
        input.blur();
      } else {
        input.focus();
      }
    }
    e.preventDefault();
  };

  const clearNextFocus = () => {
    core.nextFocusElemRef.current = undefined;
  };

  return {
    onInputChange,
    onRemove,
    onPillFocus,
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
    clearNextFocus,
  };
}

export function useDropdownInputState<TFieldValues extends FieldValues>(
  params: UseDropdownInputStateParams<TFieldValues>,
) {
  const core = useDropdownCore(params);
  const handlers = useDropdownHandlers(core);

  return {
    error: core.error,
    disabled: core.disabled,
    value: core.value,
    selectedOptions: core.selectedOptions,
    getLabel: core.getLabel,
    isSelected: core.isSelected,
    inputValue: core.inputValue,
    isExpanded: core.isExpanded,
    filteredOptions: core.filteredOptions,
    hasCreateItem: core.hasCreateItem,
    setDraftValue: core.setDraftValue,
    ...handlers,
  };
}

export type DropdownInputState = ReturnType<typeof useDropdownInputState>;

export type { SelectValue };
