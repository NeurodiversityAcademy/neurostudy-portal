import type { SelectOption } from '@/app/interfaces/FormElements';

export type SelectValue = SelectOption['value'];

function isBlankSelection(item: unknown): boolean {
  if (item == null) {
    return true;
  }
  return String(item).trim() === '';
}

/** Clear/deselect paths may store '' instead of []; never treat that as a selected value. */
export function toSelectedOptions(value: unknown): SelectValue[] {
  if (value == null) {
    return [];
  }
  if (value === '') {
    return [];
  }
  const values = Array.isArray(value) ? value : [value];
  return values.filter((item) => !isBlankSelection(item));
}

export function buildOptionLookup(options: readonly SelectOption[]) {
  const byValue: Record<string, SelectOption> = {};
  for (const item of options) {
    byValue[String(item.value)] = item;
  }
  return {
    getLabel: (val: SelectValue): SelectOption['label'] => {
      const match = byValue[String(val)];
      if (match) {
        return match.label;
      }
      return String(val);
    },
    exists: (val: SelectValue): boolean => String(val) in byValue,
  };
}

export function buildSelectedLookup(selectedOptions: readonly SelectValue[]) {
  const selected: Record<string, true> = {};
  for (const item of selectedOptions) {
    selected[String(item).toLowerCase()] = true;
  }
  return (val: SelectValue): boolean => String(val).toLowerCase() in selected;
}

export function filterSearchableOptions(
  options: readonly SelectOption[],
  inputValue: string,
  searchable: boolean,
): SelectOption[] {
  if (!searchable) {
    return [...options];
  }
  const query = inputValue.toLowerCase();
  return options.filter((option) => option.label.toLowerCase().includes(query));
}

export function nextSelectedValues(
  selectedOptions: readonly SelectValue[],
  value: SelectValue,
  selected: boolean,
  multiple: boolean,
): SelectValue[] {
  if (!multiple) {
    return selected ? [value] : [];
  }
  if (selected) {
    return [...selectedOptions, value];
  }
  return selectedOptions.filter((item) => item !== value);
}

export function fieldValueFromSelection(cleaned: SelectValue[], multiple: boolean): unknown {
  if (multiple) {
    return cleaned;
  }
  if (cleaned.length) {
    return cleaned[0];
  }
  return '';
}

export function canCreateOption(params: {
  disabled?: boolean;
  creatable?: boolean;
  inputValue: string;
  exists: (val: SelectValue) => boolean;
  isSelected: (val: SelectValue) => boolean;
}): boolean {
  const trimmed = params.inputValue.trim();
  if (params.disabled) {
    return false;
  }
  if (!params.creatable) {
    return false;
  }
  if (!trimmed) {
    return false;
  }
  if (params.exists(trimmed)) {
    return false;
  }
  if (params.isSelected(trimmed)) {
    return false;
  }
  return true;
}

export function resolveDisplayInputValue(
  multiple: boolean,
  selectedOptions: readonly SelectValue[],
  draft: string,
  getLabel: (val: SelectValue) => string,
): string {
  if (!multiple && selectedOptions.length) {
    return getLabel(selectedOptions[0]);
  }
  return draft;
}
