import {
  FocusEvent,
  ForwardedRef,
  forwardRef,
  HTMLAttributes,
  SyntheticEvent,
  useId,
  useImperativeHandle,
  useRef,
} from 'react';
import styles from './pill.module.css';
import { PillFocusEventHandler, PillRef } from '@/app/interfaces/Pill';
import CloseButton from '../../buttons/CloseButton';

type DefaultValue = string | number;

interface PillProps<Value = DefaultValue>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onFocus'> {
  label: string;
  value?: Value | DefaultValue;
  selected?: boolean;
  canClose?: boolean;
  onFocus?: PillFocusEventHandler;
  disabled?: boolean;
  onClose?: (
    value: Value | DefaultValue,
    e: SyntheticEvent<HTMLButtonElement>
  ) => void;
  'button-aria-label'?: string | null;
}

const Pill = <Value,>(
  {
    label,
    value = '',
    onClose,
    selected = false,
    canClose = true,
    onFocus: _onFocus,
    disabled,
    'button-aria-label': buttonAriaLabel = null,
    ...rest
  }: PillProps<Value>,
  ref: ForwardedRef<PillRef>
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const labelId = useId();
  useImperativeHandle(
    ref,
    () => ({ focus: () => btnRef.current?.focus() }),
    []
  );

  const onFocus =
    _onFocus &&
    ((e: FocusEvent<HTMLButtonElement>) => {
      _onFocus({ parent: containerRef.current }, e);
    });

  return (
    <div
      ref={containerRef}
      className={styles.pill}
      role='button'
      aria-labelledby={labelId}
      aria-pressed={selected}
      aria-disabled={disabled}
      {...rest}
    >
      <label id={labelId}>{label}</label>
      {selected && canClose && (
        <CloseButton
          ref={btnRef}
          className={styles.clear}
          onFocus={onFocus}
          onClick={onClose && ((e) => onClose(value, e))}
          disabled={disabled}
          {...(buttonAriaLabel !== null && {
            'aria-label': buttonAriaLabel,
          })}
        />
      )}
    </div>
  );
};

export default forwardRef(Pill) as <Value = DefaultValue>(
  props: PillProps<Value> & { ref?: ForwardedRef<PillRef> }
) => React.ReactElement<any>;
