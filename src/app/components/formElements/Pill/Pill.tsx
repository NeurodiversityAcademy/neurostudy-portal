import {
  FocusEvent,
  ForwardedRef,
  forwardRef,
  HTMLAttributes,
  SyntheticEvent,
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
  value: Value;
  selected?: boolean;
  canClose?: boolean;
  onFocus?: PillFocusEventHandler;
  onClose: (value: Value, e: SyntheticEvent<HTMLButtonElement>) => void;
}

const Pill = <Value,>(
  {
    label,
    value,
    onClose,
    selected = false,
    canClose = true,
    onFocus: _onFocus,
    ...rest
  }: PillProps<Value>,
  ref: ForwardedRef<PillRef>
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
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
      aria-label={label.toString()}
      role='option'
      aria-selected={selected}
      {...rest}
    >
      <label>{label}</label>
      {selected && canClose && (
        <CloseButton
          ref={btnRef}
          className={styles.clear}
          onFocus={onFocus}
          onClick={(e) => onClose(value, e)}
        />
      )}
    </div>
  );
};

export default forwardRef(Pill) as <Value = DefaultValue>(
  props: PillProps<Value> & { ref?: ForwardedRef<PillRef> }
) => React.ReactElement;
