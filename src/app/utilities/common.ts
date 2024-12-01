import { Metadata } from 'next';
import { MetadataParams } from '../interfaces/MetadataProps';
import { metadata } from './metadata/metadata';
import {
  LANGUAGES,
  LOCALE,
  META_KEY,
  SITE_NAME,
  TOAST_DEV_IN_PROGRESS_MESSAGE,
  TOAST_UNKNOWN_ERROR_MESSAGE,
} from './constants';
import { AxiosError, AxiosRequestConfig } from 'axios';
import toast from '../components/toaster';
import { SelectOption } from '../interfaces/FormElements';
import { ToastOptions } from './toaster/constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any) => any;

export const debounce = <T extends AnyFunction>(
  fn: T,
  threshold: number = 500,
  context: object | null = null
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>): void {
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, threshold);
  };
};

export const throttle = <T extends AnyFunction>(
  fn: T,
  threshold: number = 500,
  context: object | null = null
): ((...args: Parameters<T>) => void) => {
  let last: number = -1,
    timer: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>): void {
    const now = Date.now();

    if (last && now < last + threshold) {
      clearTimeout(timer);
      timer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
};

export const createMetadata = (
  key: META_KEY,
  customMetadata?: Partial<MetadataParams>
): Metadata => {
  const { canonical, type, images, ...rest } = {
    ...metadata[key],
    ...customMetadata,
  };

  return {
    alternates: {
      canonical,
      languages: LANGUAGES,
    },
    openGraph: {
      title: rest.title || undefined,
      description: rest.description || undefined,
      url: canonical,
      images,
      ...(type && { type }),
      siteName: SITE_NAME,
      locale: LOCALE,
    },
    ...rest,
  };
};

export const notifyError = (ex: object | string, options?: ToastOptions) => {
  const message =
    (typeof ex === 'string' ? ex : ex instanceof Error && ex.message) ||
    TOAST_UNKNOWN_ERROR_MESSAGE;

  toast.error(message, options);
};

export const notifySuccess = (message: string) => {
  toast.success(message);
};

export const notifyInProgress = () => {
  toast.info(TOAST_DEV_IN_PROGRESS_MESSAGE);
};

export const getAxiosErrorMessage = (ex: object): string => {
  return ex instanceof AxiosError
    ? ex.response?.data?.message || ex.message
    : TOAST_UNKNOWN_ERROR_MESSAGE;
};

export const notifyAxiosError = (ex: unknown) => {
  process.env.NODE_ENV === 'development' && console.error(ex);
  notifyError(getAxiosErrorMessage(ex as object));
};

export const createRequestConfig = <D = unknown>(
  path: string,
  data?: D,
  rest?: Partial<AxiosRequestConfig<D>>
): AxiosRequestConfig<D> => {
  return {
    method: rest?.method || 'POST',
    url: '/api' + path,
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...rest,
  };
};

export const getUniqueID = (): string => {
  return 'u' + Math.random().toString(32).substring(2);
};

export const isObjEmpty = (
  data: Record<string | number | symbol, unknown>
): boolean => {
  for (const _ in data) {
    return false;
  }
  return true;
};

export const emptyFunc = () => void 0;

export const getLabelOption = (option: string | SelectOption): SelectOption => {
  return typeof option === 'string' ? { label: option, value: option } : option;
};

export const getSearchQuery = <T>(
  params: Record<string, T>,
  filter?: (key: string, value: T) => boolean
): string => {
  return Object.entries(params)
    .filter(
      ([key, value]) => value !== undefined && (!filter || filter(key, value))
    )
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');
};

export const compare = (fstValue: unknown, sndValue: unknown): boolean => {
  if (fstValue === sndValue) {
    return true;
  }

  if (!fstValue || !sndValue) {
    return fstValue === sndValue;
  }

  const isFstValueArray = Array.isArray(fstValue);
  const isSndValueArray = Array.isArray(sndValue);

  if (isFstValueArray !== isSndValueArray) {
    return false;
  }

  if (isFstValueArray) {
    const val1 = fstValue as unknown[];
    const val2 = sndValue as unknown[];

    return (
      val1.length === val2.length &&
      !val1.some((item, index) => !compare(item, val2[index]))
    );
  } else if (typeof fstValue === 'object' && typeof sndValue === 'object') {
    const val1 = fstValue as Record<string, unknown>;
    const val2 = sndValue as Record<string, unknown>;
    const keys1 = Object.keys(fstValue);
    const keys2 = Object.keys(sndValue);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (!(key in val2) || !compare(val1[key], val2[key])) {
        return false;
      }
    }

    return true;
  }

  return fstValue === sndValue;
};

export function formatDate(year: number, month: number, day: number) {
  const date = new Date(year, month - 1, day);
  const normalizedYear = date.getFullYear();
  const normalizedMonth = String(date.getMonth() + 1).padStart(2, '0');
  const normalizedDay = String(date.getDate()).padStart(2, '0');

  return `${normalizedYear}-${normalizedMonth}-${normalizedDay}`;
}
