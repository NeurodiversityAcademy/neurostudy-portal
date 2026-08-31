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
  context: object | null = null,
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
  context: object | null = null,
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

export const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text

/** FNV-1a style hash for deterministic seeded picks during render. */
export const hashString = (value: string): number => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

/**
 * Pure Fisher–Yates pick. Same seed + items always yields the same result,
 * so it is safe to call during render (unlike Math.random).
 */
export const pickSeeded = <T>(items: readonly T[], count: number, seed: string): T[] => {
  if (count <= 0 || items.length === 0) {
    return [];
  }

  const copy = [...items];
  let state = hashString(seed) || 1;
  const next = (): number => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    const current = copy[i];
    copy[i] = copy[j] as T;
    copy[j] = current as T;
  }

  return copy.slice(0, count);
};

const getTwitterImages = (ogImages: MetadataParams['images']): string | string[] | undefined => {
  if (!ogImages) {
    return undefined;
  }

  const toUrl = (image: string | URL | { url: string | URL }): string =>
    typeof image === 'string' ? image : image instanceof URL ? image.toString() : String(image.url);

  return Array.isArray(ogImages) ? ogImages.map(toUrl) : toUrl(ogImages);
};

export const createMetadata = (
  key: META_KEY,
  customMetadata?: Partial<MetadataParams>,
): Metadata => {
  const { canonical, type, images, ...rest } = {
    ...metadata[key],
    ...customMetadata,
  };
  const twitterImages = getTwitterImages(images);

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
    twitter: {
      card: 'summary_large_image',
      title: rest.title || undefined,
      description: rest.description || undefined,
      ...(twitterImages && { images: twitterImages }),
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
  if (process.env.NODE_ENV === 'development') {
    console.error(ex);
  }
  notifyError(getAxiosErrorMessage(ex as object));
};

export const createRequestConfig = <D = unknown>(
  path: string,
  data?: D,
  rest?: Partial<AxiosRequestConfig<D>>,
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

export const isObjEmpty = (data: Record<string | number | symbol, unknown>): boolean => {
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
  filter?: (key: string, value: T) => boolean,
): string => {
  return Object.entries(params)
    .filter(([key, value]) => value !== undefined && (!filter || filter(key, value)))
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

    return val1.length === val2.length && !val1.some((item, index) => !compare(item, val2[index]));
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

export function downloadContent(blob: Blob, filename?: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'nda-download-content';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
