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
) => {
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
      type,
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

export const getAxiosAuthErrorMessage = (ex: object): string => {
  return ex instanceof AxiosError
    ? ex.response?.data?.message || ex.message
    : TOAST_UNKNOWN_ERROR_MESSAGE;
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
