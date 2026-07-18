'use client';

import React, { useEffect, useState } from 'react';
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
  const [toasts, setToasts] = useState<ToastItemProps[]>([]);

  const addToastItem = (newToast: ToastItemProps) => {
    setToasts((previous) => [...previous, newToast]);
  };

  const hideToastItem = (id: ToastItemProps['id']) => {
    setToasts((previous) =>
      previous.map((item) => (item.id === id ? { ...item, hide: true } : item)),
    );
  };

  const removeToastItem = (id: ToastItemProps['id']) => {
    setToasts((previous) => previous.filter(({ id: itemId }) => id !== itemId));
  };

  useEffect(() => {
    const addToast = (type: ToastItemProps['type'], ...rest: Parameters<ToastFunction>) => {
      const id = getUniqueID();
      const message: ToastItemProps['message'] = rest[0];
      const options: ToastOptions = rest[1] || {};
      const duration: ToastItemProps['duration'] = options.duration || ToastDefaultDuration[type];
      const newToast: ToastItemProps = {
        ...options,
        id,
        type,
        message,
        duration,
      };

      addToastItem(newToast);

      if (duration !== -1) {
        setTimeout(() => {
          hideToastItem(id);
        }, duration);
      }
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
  }, []);

  return (
    <div className={styles.container}>
      {toasts.map((item: ToastItemProps) => {
        const { id, type, hide } = item;
        const iconClassName = styles[ToastIconClass[type]];

        return (
          <div
            key={id}
            className={classNames(styles.containerItem, hide && styles.hide)}
            onAnimationEnd={({ animationName }) => {
              if (animationName === styles['containerItemHide']) {
                removeToastItem(id);
              }
            }}
          >
            <div
              className={classNames(styles.containerBody, styles[ToastContainerItemClass[type]])}
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
