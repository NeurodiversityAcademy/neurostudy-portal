import type { SelectOption } from '@/app/interfaces/FormElements';

export type SelectValue = SelectOption['value'];

/** Clear/deselect paths may store '' instead of []; never treat that as a selected value. */
export function toSelectedOptions(value: unknown): SelectValue[] {
  if (value == null || value === '') {
    return [];
  }
  const values = Array.isArray(value) ? value : [value];
  return values.filter((item) => item != null && String(item).trim() !== '');
}

export function buildOptionLookup(options: readonly SelectOption[]) {
  const byValue: Record<string, SelectOption> = {};
  for (const item of options) {
    byValue[String(item.value)] = item;
  }
  return {
    getLabel: (val: SelectValue): SelectOption['label'] =>
      byValue[String(val)]?.label || String(val),
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
  return cleaned.length ? cleaned[0] : '';
}

export function canCreateOption(params: {
  disabled?: boolean;
  creatable?: boolean;
  inputValue: string;
  exists: (val: SelectValue) => boolean;
  isSelected: (val: SelectValue) => boolean;
}): boolean {
  const trimmed = params.inputValue.trim();
  if (params.disabled || !params.creatable || !trimmed) {
    return false;
  }
  return !params.exists(trimmed) && !params.isSelected(trimmed);
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
