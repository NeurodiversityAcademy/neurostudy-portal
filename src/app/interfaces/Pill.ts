import { FocusEvent } from 'react';

export interface PillRef {
  focus: () => void;
}

export interface FocusProps {
  parent: HTMLDivElement | null;
}

export type PillFocusEventHandler = (
  focusProps: FocusProps,
  event: FocusEvent<HTMLButtonElement>
) => void;
