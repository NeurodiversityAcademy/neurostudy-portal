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

type RegulatorPropFn = (...args: unknown[]) => unknown;

export const debounce = (
  fn: RegulatorPropFn,
  threshold: number = 500,
  context: object | null = null
) => {
  let timer: ReturnType<typeof setTimeout>;
  return function (...args: unknown[]) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, threshold);
  };
};

export const throttle = (
  fn: RegulatorPropFn,
  threshold: number = 500,
  context: object | null = null
) => {
  let last: number = -1,
    timer: ReturnType<typeof setTimeout>;

  return function (...args: unknown[]) {
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
  const config = { ...metadata[key], ...customMetadata };
  const { title, description, keywords, canonical, type, images } = config;

  const metadataObj: Metadata = {
    title,
    keywords,
    description,
    alternates: {
      canonical,
      languages: LANGUAGES,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images,
      ...(type && { type }),
      siteName: SITE_NAME,
      locale: LOCALE,
    },
  };

  return metadataObj;
};

export const notifyError = (ex: object | string) => {
  const message =
    (typeof ex === 'string' ? ex : ex instanceof Error && ex.message) ||
    TOAST_UNKNOWN_ERROR_MESSAGE;

  toast.error(message);
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
  filter?: (value: T) => boolean
): string => {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && (!filter || filter(value)))
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
