'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './toaster.module.css';
import classNames from 'classnames';
import {
  ToastContainerItemClass,
  ToastDefaultDuration,
  ToastFunction,
  ToastIconClass,
  ToastItemProps,
  ToastOptions,
} from '@/app/utilities/toaster/constants';
import { constructToast, destructToast } from '.';
import { getUniqueID } from '@/app/utilities/common';

const ToasterWrapper: React.FC = () => {
  const toastsRef = useRef<ToastItemProps[]>([]);
  // NOTE
  // Utilized to trigger a `forceUpdate`
  const setToken = useState<number>(0)[1];

  const addToastItem = (newToast: ToastItemProps) => {
    toastsRef.current = [...toastsRef.current, newToast];
    setToken(Math.random());
  };

  const hideToastItem = (id: ToastItemProps['id']) => {
    let toastItemFound = false;
    const newToasts: ToastItemProps[] = toastsRef.current.map(
      (item: ToastItemProps) => {
        if (item.id === id) {
          toastItemFound = true;
          return { ...item, hide: true };
        }
        return item;
      }
    );
    if (toastItemFound) {
      toastsRef.current = newToasts;
      setToken(Math.random());
    }
  };

  const removeToastItem = (id: ToastItemProps['id']) => {
    const newToasts: ToastItemProps[] = toastsRef.current.filter(
      ({ id: itemId }) => id !== itemId
    );
    if (newToasts.length !== toastsRef.current.length) {
      toastsRef.current = newToasts;
      setToken(Math.random());
    }
  };

  useEffect(() => {
    const addToast = (
      type: ToastItemProps['type'],
      ...rest: Parameters<ToastFunction>
    ) => {
      const id = getUniqueID();
      const message: ToastItemProps['message'] = rest[0];
      const options: ToastOptions = rest[1] || {};
      const duration: ToastItemProps['duration'] =
        options.duration || ToastDefaultDuration[type];
      const newToast: ToastItemProps = {
        ...options,
        id,
        type,
        message,
        duration,
      };

      addToastItem(newToast);

      duration !== -1 &&
        setTimeout(() => {
          hideToastItem(id);
        }, duration);
    };

    constructToast({
      error: (...args: Parameters<ToastFunction>) => {
        addToast('error', ...args);
      },
      success: (...args: Parameters<ToastFunction>) => {
        addToast('success', ...args);
      },
      info: (...args: Parameters<ToastFunction>) => {
        addToast('info', ...args);
      },
    });

    return () => {
      destructToast();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      {toastsRef.current.map((item: ToastItemProps) => {
        const { id, type, hide } = item;
        const iconClassName = styles[ToastIconClass[type]];

        return (
          <div
            key={id}
            className={classNames(styles.containerItem, hide && styles.hide)}
            onAnimationEnd={({ animationName }) => {
              animationName === styles['containerItemHide'] &&
                removeToastItem(id);
            }}
          >
            <div
              className={classNames(
                styles.containerBody,
                styles[ToastContainerItemClass[type]]
              )}
            >
              {iconClassName && <div className={iconClassName} />}
              <div>{item.message}</div>
              <button
                className={styles.closeBtn}
                onClick={() => hideToastItem(id)}
                aria-label='Close'
              >
                &times;
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ToasterWrapper;
