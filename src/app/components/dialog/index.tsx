'use client';

import classNames from 'classnames';
import {
  MouseEventHandler,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './dialog.module.css';
import { createPortal } from 'react-dom';
import useHideOverflowEffect from '@/app/hooks/useHideOverflowEffect';

interface Props {
  open: boolean;
  children?: ReactNode;
  onClose?: MouseEventHandler;
  usePortal?: boolean;
}

const Dialog: React.FC<Props> = ({
  open,
  onClose,
  children,
  usePortal = true,
}) => {
  const childrenRef = useRef<ReactNode>();
  const [isRendered, setIsRendered] = useState<boolean>(open);
  if (children) {
    childrenRef.current = children;
  }

  const hideOverflow = useHideOverflowEffect();

  useEffect(() => {
    if (open) {
      setIsRendered(true);
      return hideOverflow();
    } else {
      // TODO
      // The value `300` should be used as a constant that matches
      // the specified css animation duration
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open, hideOverflow]);

  if (!isRendered) {
    return null;
  }

  const element = (
    <div
      className={classNames(
        styles.container,
        open ? styles.open : styles.closed
      )}
    >
      <div className={styles.backdrop} onClick={onClose} />
      <dialog open className={styles.content}>
        {childrenRef.current}
      </dialog>
    </div>
  );

  return usePortal ? createPortal(element, document.body) : element;
};

export default Dialog;
