import { ReactNode } from 'react';

export interface ToastItemProps {
  id: string;
  type: 'error' | 'success' | 'info';
  hide?: boolean;
  message: ReactNode;
  duration: number;
}

export type ToastOptions = Partial<Omit<ToastItemProps, 'id' | 'type' | 'hide'>>;

export type ToastFunction = (message: ToastItemProps['message'], options?: ToastOptions) => void;

export interface ToastType {
  error: ToastFunction;
  success: ToastFunction;
  info: ToastFunction;
}

export enum ToastContainerItemClass {
  error = 'errorBody',
  success = 'successBody',
  info = '',
}

export enum ToastIconClass {
  error = 'errorIcon',
  success = 'successIcon',
  info = '',
}

export enum ToastDefaultDuration {
  error = 5000,
  info = 4000,
  success = 2000,
}
