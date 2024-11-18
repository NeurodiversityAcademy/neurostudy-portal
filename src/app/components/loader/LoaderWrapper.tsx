import { ReactNode } from 'react';
import styles from './loader.module.css';
import Loader from './Loader';
import classNames from 'classnames';

interface LoaderWrapperProps {
  isLoading: boolean;
  children: ReactNode;
  className?: string;
  expandLoaderWidth?: boolean;
  loaderAlignTop?: boolean;
}

// TODO: Remove all use of <LoaderWrapper />, integrating the <Loader />
// to a parent should suffice
export default function LoaderWrapper({
  isLoading,
  children,
  className,
  expandLoaderWidth = false,
  loaderAlignTop = false,
}: LoaderWrapperProps) {
  return (
    <div
      className={classNames(
        styles.container,
        className,
        isLoading && styles.loaderContainer
      )}
    >
      {children}
      <Loader
        isLoading={isLoading}
        expand={expandLoaderWidth}
        alignTop={loaderAlignTop}
      />
    </div>
  );
}
