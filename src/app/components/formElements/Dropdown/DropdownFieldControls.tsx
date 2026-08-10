'use client';

import { ChangeEvent, KeyboardEvent, MouseEvent, Ref } from 'react';
import classNames from 'classnames';
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
import ClearButton from '../ClearButton/ClearButton';
import ArrowDownIcon from '../../images/ArrowDown';
import styles from './dropdown.module.css';

type DropdownFieldControlsProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  value: PathValue<TFieldValues, Path<TFieldValues>>;
  methods: UseFormReturn<TFieldValues>;
  error?: boolean;
  pillsBelow: boolean;
  hasInlinePills: boolean;
  clearable: boolean;
  disabled?: boolean;
  searchable: boolean;
  showInputAsText: boolean;
  showTextControl: boolean;
  placeholder?: string;
  inputValue: string;
  inlinePills: React.ReactNode;
  inputRef: Ref<HTMLInputElement | HTMLSpanElement>;
  onBlurCapture: () => void;
  onMouseDown: (e: MouseEvent<HTMLElement>) => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onInputKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onClearDraft: () => void;
  onToggleExpand: (e: MouseEvent) => void;
};

function DropdownTextControl({
  inputRef,
  showInputAsText,
  searchable,
  disabled,
  placeholder,
  inputValue,
  onInputChange,
  onInputKeyDown,
}: {
  inputRef: Ref<HTMLInputElement | HTMLSpanElement>;
  showInputAsText: boolean;
  searchable: boolean;
  disabled?: boolean;
  placeholder?: string;
  inputValue: string;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onInputKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}) {
  if (showInputAsText) {
    return (
      <span ref={inputRef} className={styles.inputAsText} tabIndex={0}>
        {inputValue}
      </span>
    );
  }

  return (
    <input
      ref={inputRef as Ref<HTMLInputElement>}
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
  );
}

function wrapperClassName(error?: boolean, pillsBelow?: boolean): string {
  return classNames(
    styles.inputWrapper,
    error ? styles.error : undefined,
    pillsBelow ? styles.inputWrapperPillsBelow : undefined,
    // NOTE: Exposing for CSS Selectors
    'dropdown-input-wrapper',
  );
}

function pillRowClassName(hasInlinePills: boolean, pillsBelow: boolean): string {
  return classNames(
    styles.pillAndInput,
    hasInlinePills ? styles.hasValue : undefined,
    pillsBelow ? styles.pillAndInputSingleLine : undefined,
  );
}

export default function DropdownFieldControls<TFieldValues extends FieldValues>({
  name,
  value,
  methods,
  error,
  pillsBelow,
  hasInlinePills,
  clearable,
  disabled,
  searchable,
  showInputAsText,
  showTextControl,
  placeholder,
  inputValue,
  inlinePills,
  inputRef,
  onBlurCapture,
  onMouseDown,
  onInputChange,
  onInputKeyDown,
  onClearDraft,
  onToggleExpand,
}: DropdownFieldControlsProps<TFieldValues>) {
  return (
    <div
      className={wrapperClassName(error, pillsBelow)}
      onBlurCapture={onBlurCapture}
      onMouseDown={onMouseDown}
    >
      <div className={pillRowClassName(hasInlinePills, pillsBelow)} onMouseDown={onMouseDown}>
        {inlinePills}
        {showTextControl ? (
          <DropdownTextControl
            inputRef={inputRef}
            showInputAsText={showInputAsText}
            searchable={searchable}
            disabled={disabled}
            placeholder={placeholder}
            inputValue={inputValue}
            onInputChange={onInputChange}
            onInputKeyDown={onInputKeyDown}
          />
        ) : null}
      </div>
      {clearable ? (
        <ClearButton
          name={name}
          value={value}
          methods={methods}
          className={styles.clearBtn}
          disabled={disabled}
          onClick={onClearDraft}
        />
      ) : null}
      <ArrowDownIcon aria-hidden className={styles.expandIcon} onMouseDown={onToggleExpand} />
    </div>
  );
}
