import { Metadata } from 'next';
import { MetadataParams } from '../interfaces/MetadataProps';
import { metadata } from './metadata/metadata';
import {
  LANGUAGES,
  LOCALE,
  META_KEY,
  SITE_NAME,
  TOAST_UNKNOWN_ERROR_MESSAGE,
} from './constants';
import toast from 'react-hot-toast';

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

export const notifyError = (ex: object) => {
  const message =
    (ex instanceof Error && ex.message) || TOAST_UNKNOWN_ERROR_MESSAGE;

  toast.error(message);
};
