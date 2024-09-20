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

interface Props {
  open: boolean;
  children?: ReactNode;
  onClose?: MouseEventHandler;
}

const Dialog: React.FC<Props> = ({ open, onClose, children }) => {
  const childrenRef = useRef<ReactNode>();
  const [isRendered, setIsRendered] = useState<boolean>(open);
  if (children) {
    childrenRef.current = children;
  }

  useEffect(() => {
    if (open) {
      setIsRendered(true);
    } else {
      // TODO
      // The value `300` should be used as a constant that matches
      // the specified css animation duration
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!isRendered) {
    return null;
  }

  return createPortal(
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
    </div>,
    document.body
  );
};

export default Dialog;
