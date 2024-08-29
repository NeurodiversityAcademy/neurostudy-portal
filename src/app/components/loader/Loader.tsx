'use client';

import { useEffect, useRef } from 'react';
import styles from './loader.module.css';
import classNames from 'classnames';

interface LoaderProps {
  isLoading: boolean;
  target?: HTMLElement;
  expand?: boolean;
  alignTop?: boolean;
}

export default function Loader({
  isLoading,
  target,
  expand = false,
  alignTop = false,
}: LoaderProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isLoading) {
      const parentNode = (target || ref.current?.parentNode) as Element;
      if (!parentNode) {
        return;
      }

      if (getComputedStyle(parentNode).position === 'static') {
        if (!parentNode.classList.contains('position-relative')) {
          parentNode.classList.add('position-relative');

          return () => {
            parentNode.classList.remove('position-relative');
          };
        }
      }
    }
  }, [isLoading, target]);

  return (
    isLoading && (
      <div
        className={classNames(
          styles.loader,
          expand && styles.expand,
          alignTop && styles.loaderAlignTop
        )}
      >
        <span className={styles.circle} />
        <span className={styles.circle} />
        <span className={styles.circle} />
      </div>
    )
  );
}
