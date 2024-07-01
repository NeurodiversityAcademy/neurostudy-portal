// NOTE
// This is the old `TextArea` component. We will be slowly moving towards the new `TextArea`
// component placed in the `formElements` folder - which utilizes `react-hook-form`

import React, { ChangeEvent } from 'react';
import styles from './textarea.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';

export enum TextAreaVariant {
  LONG = 'long',
  REGULAR = 'regular',
}

type TextAreaProps = {
  name: string;
  label: string;
  value: string;
  required: boolean;
  placeholder: string;
  errorMessage?: string;
  className?: string;
  rows?: number;
  cols?: number;
  maxlength?: number;
  spellCheck?: boolean;
  variant?: TextAreaVariant;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void;
};

export default function TextArea(props: TextAreaProps) {
  const defaultRows = 5;
  const defaultCols = 10;

  return (
    <div className={styles.textAreaContainer}>
      <label htmlFor={props.name} className={styles.label}>
        <Typography
          variant={TypographyVariant.Body2}
          color={props.errorMessage && 'red'}
        >
          {props.label}
        </Typography>
      </label>
      <textarea
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        required={props.required}
        placeholder={props.placeholder}
        className={styles.message}
        onBlur={props.onBlur}
        rows={props.rows || defaultRows}
        cols={props.cols || defaultCols}
        maxLength={props.maxlength}
        spellCheck={props.spellCheck}
      />
      {props.errorMessage && (
        <span className={styles.errorMessage}>{props.errorMessage}</span>
      )}
    </div>
  );
}
