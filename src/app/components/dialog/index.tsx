'use client';

import classNames from 'classnames';
import { MouseEventHandler, ReactNode, useEffect, useState } from 'react';
import styles from './dialog.module.css';
import { createPortal } from 'react-dom';
import useHideOverflowEffect from '@/app/hooks/useHideOverflowEffect';

const CLOSE_ANIMATION_MS = 300;

interface Props {
  open: boolean;
  children?: ReactNode;
  onClose?: MouseEventHandler;
  usePortal?: boolean;
}

const Dialog: React.FC<Props> = ({ open, onClose, children, usePortal = true }) => {
  const [isRendered, setIsRendered] = useState(open);
  const [cachedChildren, setCachedChildren] = useState(children);

  if (open && !isRendered) {
    setIsRendered(true);
  }

  if (children != null && children !== cachedChildren) {
    setCachedChildren(children);
  }

  const hideOverflow = useHideOverflowEffect();

  useEffect(() => {
    if (open) {
      return hideOverflow();
    }

    const timer = setTimeout(() => setIsRendered(false), CLOSE_ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [open, hideOverflow]);

  if (!isRendered) {
    return null;
  }

  const element = (
    <div className={classNames(styles.container, open ? styles.open : styles.closed)}>
      <div className={styles.backdrop} onClick={onClose} />
      <dialog open className={styles.content}>
        {children ?? cachedChildren}
      </dialog>
    </div>
  );

  return usePortal ? createPortal(element, document.body) : element;
};

export default Dialog;
