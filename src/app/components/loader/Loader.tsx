'use client';

import { HTMLAttributes, useEffect, useRef } from 'react';
import styles from './loader.module.css';
import classNames from 'classnames';

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
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
  className,
  ...rest
}: LoaderProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) {
      const parentNode = (target || ref.current?.parentNode) as Element;
      if (!parentNode) {
        return;
      }

      parentNode.classList.add(styles.loaderContainer);
      getComputedStyle(parentNode).position === 'static' &&
        parentNode.classList.add(styles.loaderContainerRelative);

      return () => {
        parentNode.classList.remove(styles.loaderContainerRelative);
        parentNode.classList.remove(styles.loaderContainer);
      };
    }
  }, [isLoading, target]);

  return (
    isLoading && (
      <div
        ref={ref}
        className={classNames(
          className,
          styles.loader,
          expand && styles.expand,
          alignTop && styles.alignTop
        )}
        aria-hidden
        {...rest}
      >
        <span className={styles.circle} />
        <span className={styles.circle} />
        <span className={styles.circle} />
      </div>
    )
  );
}
