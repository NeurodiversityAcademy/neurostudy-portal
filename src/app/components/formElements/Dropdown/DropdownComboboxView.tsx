'use client';

import { FocusEvent, Ref, useId } from 'react';
import styles from './dropdown.module.css';
import classNames from 'classnames';
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
import CheckBoxItem from '../CheckBoxItem/CheckBoxItem';
import Label from '../Label/Label';
import ErrorBox from '../ErrorBox/ErrorBox';
import HelperText from '../HelperText/HelperText';
import { emptyFunc } from '@/app/utilities/common';
import DropdownFieldControls from './DropdownFieldControls';
import { type SelectValue } from './dropdownSelection';

function getComboboxAriaLabel(showLabel: boolean, label?: string): string | undefined {
  if (showLabel) {
    return undefined;
  }
  return label || undefined;
}

function CreateOptionItem({
  inputValue,
  onCreate,
}: {
  inputValue: string;
  onCreate: () => void;
}) {
  return (
    <CheckBoxItem
      label={'Add "' + inputValue + '"'}
      checked={false}
      onChange={onCreate}
      type='pill'
      role='option'
    />
  );
}

function NoOptionsItem() {
  return (
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
  );
}

function DropdownOptionItems({
  filteredOptions,
  radioMode,
  isSelected,
  onToggleOption,
}: {
  filteredOptions: { label: string; value: SelectValue }[];
  radioMode: boolean;
  isSelected: (val: SelectValue) => boolean;
  onToggleOption: (value: SelectValue, selected: boolean) => void;
}) {
  return filteredOptions.map(({ label, value }) => (
    <CheckBoxItem
      key={String(value)}
      label={label}
      checked={isSelected(value)}
      role='option'
      type={radioMode ? 'radio' : undefined}
      onChange={(selected) => onToggleOption(value, selected)}
    />
  ));
}

function showEmptyOptions(
  hasCreateItem: boolean,
  filteredCount: number,
): boolean {
  if (hasCreateItem) {
    return false;
  }
  return filteredCount === 0;
}

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
}: {
  listId: string;
  multiple: boolean;
  radioMode: boolean;
  isExpanded: boolean;
  hasCreateItem: boolean;
  inputValue: string;
  filteredOptions: { label: string; value: SelectValue }[];
  isSelected: (val: SelectValue) => boolean;
  onCreate: () => void;
  onToggleOption: (value: SelectValue, selected: boolean) => void;
  onCollapseClearDraft: () => void;
}) {
  const showEmpty = showEmptyOptions(hasCreateItem, filteredOptions.length);

  return (
    <div className={styles.dropdownListContainer}>
      <ul
        className={styles.dropdownList}
        id={listId}
        role='listbox'
        aria-multiselectable={multiple}
        onTransitionEnd={(e) => {
          if (e.target !== e.currentTarget) {
            return;
          }
          if (isExpanded) {
            return;
          }
          onCollapseClearDraft();
        }}
      >
        {hasCreateItem ? <CreateOptionItem inputValue={inputValue} onCreate={onCreate} /> : null}
        <DropdownOptionItems
          filteredOptions={filteredOptions}
          radioMode={radioMode}
          isSelected={isSelected}
          onToggleOption={onToggleOption}
        />
        {showEmpty ? <NoOptionsItem /> : null}
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

function SelectedPillsRow({ name, pills }: { name: string; pills: React.ReactNode }) {
  return (
    <div className={styles.selectedPillsBelow} data-testid={`${name}-selected-pills`}>
      {pills}
    </div>
  );
}

function containerClassName(cols: number | undefined, className: string | undefined): string {
  return classNames(
    styles.container,
    'border-box-parent',
    cols ? 'col-md-' + cols : undefined,
    className,
  );
}

function resolveErrorMessage(error: unknown, fallback?: string): string | undefined {
  if (!error) {
    return fallback;
  }
  if (typeof error !== 'object') {
    return fallback;
  }
  if (!('message' in error)) {
    return fallback;
  }
  const message = (error as { message?: unknown }).message;
  if (message == null) {
    return fallback;
  }
  return String(message);
}

function OptionalLabel({
  showLabel,
  name,
  label,
  required,
  error,
}: {
  showLabel: boolean;
  name: string;
  label?: string;
  required: boolean;
  error: unknown;
}) {
  if (!showLabel) {
    return null;
  }
  return (
    <Label name={name} color={error ? 'red' : undefined} label={label} required={required} />
  );
}

function OptionalError({
  error,
  label,
  defaultErrorMessage,
}: {
  error: unknown;
  label?: string;
  defaultErrorMessage?: string;
}) {
  if (!error) {
    return null;
  }
  return <ErrorBox message={resolveErrorMessage(error, defaultErrorMessage)} label={label} />;
}

function OptionalPillsBelow({
  show,
  name,
  pills,
}: {
  show: boolean;
  name: string;
  pills: React.ReactNode;
}) {
  if (!show) {
    return null;
  }
  return <SelectedPillsRow name={name} pills={pills} />;
}

export type DropdownComboboxViewProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label?: string;
  showLabel: boolean;
  placeholder?: string;
  helperText?: React.ReactNode;
  required: boolean;
  className?: string;
  clearable: boolean;
  radioMode: boolean;
  multiple: boolean;
  pillsBelow: boolean;
  showInputAsText: boolean;
  searchable: boolean;
  cols?: number;
  defaultErrorMessage?: string;
  methods: UseFormReturn<TFieldValues>;
  error: unknown;
  disabled?: boolean;
  value: PathValue<TFieldValues, Path<TFieldValues>>;
  selectedOptions: SelectValue[];
  isSelected: (val: SelectValue) => boolean;
  inputValue: string;
  isExpanded: boolean;
  filteredOptions: { label: string; value: SelectValue }[];
  hasCreateItem: boolean;
  selectedPills: React.ReactNode;
  showBelowPills: boolean;
  inlinePills: React.ReactNode;
  showTextControl: boolean;
  attachInputRef: (node: HTMLInputElement | HTMLSpanElement | null) => void;
  expandIfEnabled: () => void;
  collapseIfLeaving: (relatedTarget: EventTarget | null, currentTarget: EventTarget) => void;
  onKeyDown: React.KeyboardEventHandler<HTMLDivElement>;
  focusInput: (e: React.MouseEvent<HTMLElement>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClearDraft: () => void;
  onToggleExpand: (e: React.MouseEvent) => void;
  onClearNextFocus: () => void;
  createFromInput: () => void;
  toggleOption: (value: SelectValue, selected: boolean) => void;
  clearDraftOnCollapse: () => void;
};

function hasInlinePills(pillsBelow: boolean, selectedCount: number): boolean {
  if (pillsBelow) {
    return false;
  }
  return selectedCount > 0;
}

function listRadioMode(multiple: boolean, radioMode: boolean): boolean {
  if (multiple) {
    return false;
  }
  return radioMode;
}

export default function DropdownComboboxView<TFieldValues extends FieldValues>(
  props: DropdownComboboxViewProps<TFieldValues>,
) {
  const listId = useId();

  return (
    <div
      className={containerClassName(props.cols, props.className)}
      role='combobox'
      aria-controls={listId}
      aria-expanded={props.isExpanded}
      aria-disabled={props.disabled}
      aria-label={getComboboxAriaLabel(props.showLabel, props.label)}
      onFocusCapture={props.expandIfEnabled}
      onBlurCapture={(e: FocusEvent<HTMLDivElement, Element>) => {
        props.collapseIfLeaving(e.relatedTarget, e.currentTarget);
      }}
      onKeyDown={props.onKeyDown}
    >
      <OptionalLabel
        showLabel={props.showLabel}
        name={props.name}
        label={props.label}
        required={props.required}
        error={props.error}
      />
      <DropdownFieldControls
        name={props.name}
        value={props.value}
        methods={props.methods}
        error={Boolean(props.error)}
        pillsBelow={props.pillsBelow}
        hasInlinePills={hasInlinePills(props.pillsBelow, props.selectedOptions.length)}
        clearable={props.clearable}
        disabled={props.disabled}
        searchable={props.searchable}
        showInputAsText={props.showInputAsText}
        showTextControl={props.showTextControl}
        placeholder={props.placeholder}
        inputValue={props.inputValue}
        inlinePills={props.inlinePills}
        inputRef={props.attachInputRef as Ref<HTMLInputElement | HTMLSpanElement>}
        onBlurCapture={props.onClearNextFocus}
        onMouseDown={props.focusInput}
        onInputChange={props.onInputChange}
        onInputKeyDown={props.onInputKeyDown}
        onClearDraft={props.onClearDraft}
        onToggleExpand={props.onToggleExpand}
      />
      <OptionalPillsBelow
        show={props.showBelowPills}
        name={props.name}
        pills={props.selectedPills}
      />
      <DropdownList
        listId={listId}
        multiple={props.multiple}
        radioMode={listRadioMode(props.multiple, props.radioMode)}
        isExpanded={props.isExpanded}
        hasCreateItem={props.hasCreateItem}
        inputValue={props.inputValue}
        filteredOptions={props.filteredOptions}
        isSelected={props.isSelected}
        onCreate={props.createFromInput}
        onToggleOption={props.toggleOption}
        onCollapseClearDraft={props.clearDraftOnCollapse}
      />
      <HelperText>{props.helperText}</HelperText>
      <OptionalError
        error={props.error}
        label={props.label}
        defaultErrorMessage={props.defaultErrorMessage}
      />
      <HiddenSelectedValues
        name={props.name}
        multiple={props.multiple}
        selectedOptions={props.selectedOptions}
      />
    </div>
  );
}
