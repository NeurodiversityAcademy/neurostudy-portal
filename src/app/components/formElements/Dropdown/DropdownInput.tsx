'use client';

import { FieldValues } from 'react-hook-form';
import Pill from '../Pill/Pill';
import { DropdownInputProps } from '@/app/interfaces/FormElements';
import DropdownComboboxView from './DropdownComboboxView';
import { useDropdownInputState } from './useDropdownInputState';

const BUTTON_ARIA_LABEL = 'Clear';

function shouldShowPillsBelow(
  multiple: boolean,
  pillsBelow: boolean,
  selectedCount: number,
): boolean {
  if (!multiple) {
    return false;
  }
  if (!pillsBelow) {
    return false;
  }
  return selectedCount > 0;
}

function resolveInlinePills(
  multiple: boolean,
  pillsBelow: boolean,
  selectedPills: React.ReactNode,
): React.ReactNode {
  if (!multiple) {
    return null;
  }
  if (pillsBelow) {
    return null;
  }
  return selectedPills;
}

function shouldShowTextControl(disabled: boolean | undefined, selectedCount: number): boolean {
  if (!disabled) {
    return true;
  }
  return selectedCount === 0;
}

function boolProp(value: boolean | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }
  return value;
}

function isSearchableEnabled(searchable: boolean | undefined): boolean {
  return searchable !== false;
}

type ResolvedDropdownFlags = {
  showLabel: boolean;
  required: boolean;
  clearable: boolean;
  radioMode: boolean;
  multiple: boolean;
  pillsBelow: boolean;
  showInputAsText: boolean;
  searchable: boolean;
};

function resolveDropdownFlags<TFieldValues extends FieldValues>(
  props: DropdownInputProps<TFieldValues>,
): ResolvedDropdownFlags {
  return {
    showLabel: boolProp(props.showLabel, false),
    required: boolProp(props.required, false),
    clearable: boolProp(props.clearable, true),
    radioMode: boolProp(props.radioMode, false),
    multiple: boolProp(props.multiple, false),
    pillsBelow: boolProp(props.pillsBelow, false),
    showInputAsText: boolProp(props.showInputAsText, false),
    searchable: isSearchableEnabled(props.searchable),
  };
}

function SelectedOptionPills({
  options,
  getLabel,
  disabled,
  onRemove,
  onFocus,
}: {
  options: Array<string | number | boolean>;
  getLabel: (value: string | number | boolean) => string;
  disabled?: boolean;
  onRemove: (value: string | number | boolean) => void;
  onFocus: Parameters<typeof Pill>[0]['onFocus'];
}) {
  return options.map((option) => (
    <Pill
      key={String(option)}
      label={getLabel(option)}
      value={option}
      selected
      onClose={onRemove}
      onFocus={onFocus}
      disabled={disabled}
      button-aria-label={BUTTON_ARIA_LABEL}
    />
  ));
}

const DropdownInput = <TFieldValues extends FieldValues>(
  props: DropdownInputProps<TFieldValues>,
) => {
  const flags = resolveDropdownFlags(props);
  const state = useDropdownInputState(props);
  const selectedPills = (
    <SelectedOptionPills
      options={state.selectedOptions}
      getLabel={state.getLabel}
      disabled={state.disabled}
      onRemove={state.onRemove}
      onFocus={state.onPillFocus}
    />
  );

  return (
    <DropdownComboboxView
      name={props.name}
      label={props.label}
      showLabel={flags.showLabel}
      placeholder={props.placeholder}
      helperText={props.helperText}
      required={flags.required}
      className={props.className}
      clearable={flags.clearable}
      radioMode={flags.radioMode}
      multiple={flags.multiple}
      pillsBelow={flags.pillsBelow}
      showInputAsText={flags.showInputAsText}
      searchable={flags.searchable}
      cols={props.cols}
      defaultErrorMessage={props.defaultErrorMessage}
      methods={props.methods}
      error={state.error}
      disabled={state.disabled}
      value={state.value}
      selectedOptions={state.selectedOptions}
      isSelected={state.isSelected}
      inputValue={state.inputValue}
      isExpanded={state.isExpanded}
      filteredOptions={state.filteredOptions}
      hasCreateItem={state.hasCreateItem}
      selectedPills={selectedPills}
      showBelowPills={shouldShowPillsBelow(
        flags.multiple,
        flags.pillsBelow,
        state.selectedOptions.length,
      )}
      inlinePills={resolveInlinePills(flags.multiple, flags.pillsBelow, selectedPills)}
      showTextControl={shouldShowTextControl(state.disabled, state.selectedOptions.length)}
      attachInputRef={state.attachInputRef}
      expandIfEnabled={state.expandIfEnabled}
      collapseIfLeaving={state.collapseIfLeaving}
      onKeyDown={state.onKeyDown}
      focusInput={state.focusInput}
      onInputChange={state.onInputChange}
      onInputKeyDown={state.onInputKeyDown}
      onClearDraft={() => {
        state.setDraftValue('');
      }}
      onToggleExpand={state.toggleExpand}
      onClearNextFocus={() => {
        state.nextFocusElemRef.current = undefined;
      }}
      createFromInput={state.createFromInput}
      toggleOption={state.toggleOption}
      clearDraftOnCollapse={state.clearDraftOnCollapse}
    />
  );
};

export default DropdownInput;
