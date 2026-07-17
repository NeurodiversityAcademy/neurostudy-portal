import { AxiosError, AxiosHeaders } from 'axios';
import {
  META_KEY,
  TOAST_DEV_IN_PROGRESS_MESSAGE,
  TOAST_UNKNOWN_ERROR_MESSAGE,
  LANGUAGES,
  LOCALE,
  SITE_NAME,
} from '../constants';
import { metadata } from '../metadata/metadata';

jest.mock('../../components/toaster', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
  },
}));

import toast from '../../components/toaster';
import {
  debounce,
  throttle,
  slugify,
  createMetadata,
  notifyError,
  notifySuccess,
  notifyInProgress,
  getAxiosErrorMessage,
  notifyAxiosError,
  createRequestConfig,
  getUniqueID,
  isObjEmpty,
  emptyFunc,
  getLabelOption,
  getSearchQuery,
  compare,
  formatDate,
  downloadContent,
} from '../common';

const mockedToast = jest.mocked(toast);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('debounce', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('calls fn after the default threshold', () => {
    const fn = jest.fn();
    const debounced = debounce(fn);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('resets timer on repeated calls within threshold', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);

    debounced();
    jest.advanceTimersByTime(200);
    debounced();
    jest.advanceTimersByTime(200);

    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('respects a custom threshold', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 1000);

    debounced();
    jest.advanceTimersByTime(999);
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('passes arguments to the underlying function', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);

    debounced('a', 'b');
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledWith('a', 'b');
  });

  it('uses the provided context', () => {
    const ctx = { value: 42 };
    const fn = jest.fn(function (this: typeof ctx) {
      return this.value;
    });
    const debounced = debounce(fn, 100, ctx);

    debounced();
    jest.advanceTimersByTime(100);
    expect(fn.mock.instances[0]).toBe(ctx);
  });
});

describe('throttle', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('calls fn immediately on the first invocation', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 500);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('throttles subsequent calls within the threshold', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 500);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);

    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('executes the trailing call after the threshold', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 500);

    throttled('first');
    expect(fn).toHaveBeenCalledTimes(1);

    throttled('second');
    jest.advanceTimersByTime(500);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith('second');
  });

  it('passes arguments to the underlying function', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 200);

    throttled('x', 'y');
    expect(fn).toHaveBeenCalledWith('x', 'y');
  });

  it('uses the provided context', () => {
    const ctx = { id: 1 };
    const fn = jest.fn(function (this: typeof ctx) {
      return this.id;
    });
    const throttled = throttle(fn, 200, ctx);

    throttled();
    expect(fn.mock.instances[0]).toBe(ctx);
  });
});

describe('slugify', () => {
  it('converts spaces to dashes', () => {
    expect(slugify('hello world')).toBe('hello-world');
  });

  it('converts to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(slugify('hello@world!')).toBe('helloworld');
  });

  it('collapses consecutive dashes', () => {
    expect(slugify('hello   world')).toBe('hello-world');
  });

  it('trims dashes from start and end', () => {
    expect(slugify(' hello world ')).toBe('hello-world');
  });

  it('handles mixed special chars and spaces', () => {
    expect(slugify('  --Hello  World!!-- ')).toBe('hello-world');
  });

  it('returns empty string for empty input', () => {
    expect(slugify('')).toBe('');
  });
});

describe('createMetadata', () => {
  it('returns metadata with alternates and openGraph', () => {
    const result = createMetadata(META_KEY.HOME);
    const homeData = metadata[META_KEY.HOME];

    expect(result.alternates).toEqual({
      canonical: homeData.canonical,
      languages: LANGUAGES,
    });

    expect(result.openGraph).toEqual(
      expect.objectContaining({
        title: homeData.title,
        description: homeData.description,
        url: homeData.canonical,
        siteName: SITE_NAME,
        locale: LOCALE,
      }),
    );
  });

  it('includes type in openGraph when present', () => {
    const result = createMetadata(META_KEY.HOME);
    expect(result.openGraph).toHaveProperty('type', 'website');
  });

  it('merges customMetadata overrides', () => {
    const custom = { title: 'Custom Title', description: 'Custom desc' };
    const result = createMetadata(META_KEY.HOME, custom);

    expect(result.title).toBe('Custom Title');
    expect(result.description).toBe('Custom desc');
    expect(result.openGraph).toEqual(
      expect.objectContaining({
        title: 'Custom Title',
        description: 'Custom desc',
      }),
    );
  });

  it('preserves keywords from default metadata', () => {
    const result = createMetadata(META_KEY.HOME);
    expect(result.keywords).toBe(metadata[META_KEY.HOME].keywords);
  });
});

describe('notifyError', () => {
  it('calls toast.error with a string message', () => {
    notifyError('Something went wrong');
    expect(mockedToast.error).toHaveBeenCalledWith('Something went wrong', undefined);
  });

  it('calls toast.error with message from an Error object', () => {
    notifyError(new Error('Oops'));
    expect(mockedToast.error).toHaveBeenCalledWith('Oops', undefined);
  });

  it('falls back to unknown error for non-Error objects', () => {
    notifyError({});
    expect(mockedToast.error).toHaveBeenCalledWith(TOAST_UNKNOWN_ERROR_MESSAGE, undefined);
  });

  it('passes through toast options', () => {
    const opts = { duration: 3000 };
    notifyError('fail', opts);
    expect(mockedToast.error).toHaveBeenCalledWith('fail', opts);
  });
});

describe('notifySuccess', () => {
  it('calls toast.success with the given message', () => {
    notifySuccess('Saved!');
    expect(mockedToast.success).toHaveBeenCalledWith('Saved!');
  });
});

describe('notifyInProgress', () => {
  it('calls toast.info with the dev in-progress message', () => {
    notifyInProgress();
    expect(mockedToast.info).toHaveBeenCalledWith(TOAST_DEV_IN_PROGRESS_MESSAGE);
  });
});

describe('getAxiosErrorMessage', () => {
  it('extracts message from AxiosError response data', () => {
    const err = new AxiosError('Request failed', '400', undefined, undefined, {
      data: { message: 'Bad request body' },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: { headers: new AxiosHeaders() },
    });

    expect(getAxiosErrorMessage(err)).toBe('Bad request body');
  });

  it('falls back to AxiosError.message when response.data.message is missing', () => {
    const err = new AxiosError('Network Error', 'ERR_NETWORK', undefined, undefined, {
      data: {},
      status: 500,
      statusText: 'Internal Server Error',
      headers: {},
      config: { headers: new AxiosHeaders() },
    });

    expect(getAxiosErrorMessage(err)).toBe('Network Error');
  });

  it('returns the default unknown error message for non-Axios objects', () => {
    expect(getAxiosErrorMessage({})).toBe(TOAST_UNKNOWN_ERROR_MESSAGE);
  });
});

describe('notifyAxiosError', () => {
  it('calls notifyError with the extracted axios message', () => {
    const err = new AxiosError('Server error', '500', undefined, undefined, {
      data: { message: 'DB down' },
      status: 500,
      statusText: 'Internal Server Error',
      headers: {},
      config: { headers: new AxiosHeaders() },
    });

    notifyAxiosError(err);
    expect(mockedToast.error).toHaveBeenCalledWith('DB down', undefined);
  });

  it('logs to console.error in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const spy = jest.spyOn(console, 'error').mockImplementation();

    const err = new Error('dev error');
    notifyAxiosError(err);

    expect(spy).toHaveBeenCalledWith(err);
    spy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });
});

describe('createRequestConfig', () => {
  it('defaults to POST method', () => {
    const config = createRequestConfig('/users');
    expect(config.method).toBe('POST');
  });

  it('prepends /api to the path', () => {
    const config = createRequestConfig('/users');
    expect(config.url).toBe('/api/users');
  });

  it('sets Content-Type to application/json', () => {
    const config = createRequestConfig('/test');
    expect(config.headers).toEqual({ 'Content-Type': 'application/json' });
  });

  it('includes data when provided', () => {
    const data = { name: 'Alice' };
    const config = createRequestConfig('/users', data);
    expect(config.data).toEqual(data);
  });

  it('merges rest config overrides', () => {
    const config = createRequestConfig('/users', undefined, {
      method: 'GET',
      timeout: 5000,
    });
    expect(config.method).toBe('GET');
    expect(config.timeout).toBe(5000);
  });
});

describe('getUniqueID', () => {
  it('returns a string starting with u', () => {
    const id = getUniqueID();
    expect(typeof id).toBe('string');
    expect(id[0]).toBe('u');
  });

  it('returns different values on successive calls', () => {
    const id1 = getUniqueID();
    const id2 = getUniqueID();
    expect(id1).not.toBe(id2);
  });
});

describe('isObjEmpty', () => {
  it('returns true for an empty object', () => {
    expect(isObjEmpty({})).toBe(true);
  });

  it('returns false for a non-empty object', () => {
    expect(isObjEmpty({ a: 1 })).toBe(false);
  });
});

describe('emptyFunc', () => {
  it('returns undefined', () => {
    expect(emptyFunc()).toBeUndefined();
  });
});

describe('getLabelOption', () => {
  it('wraps a string into a SelectOption', () => {
    expect(getLabelOption('foo')).toEqual({ label: 'foo', value: 'foo' });
  });

  it('passes through an existing SelectOption object', () => {
    const opt = { label: 'Bar', value: 42 };
    expect(getLabelOption(opt)).toBe(opt);
  });
});

describe('getSearchQuery', () => {
  it('builds a query string from params', () => {
    const result = getSearchQuery({ page: 1, size: 10 });
    expect(result).toBe('page=1&size=10');
  });

  it('skips undefined values', () => {
    const result = getSearchQuery({ a: 'yes', b: undefined as unknown });
    expect(result).toBe('a=yes');
  });

  it('encodes special characters', () => {
    const result = getSearchQuery({ q: 'hello world' });
    expect(result).toBe('q=hello%20world');
  });

  it('respects a custom filter', () => {
    const result = getSearchQuery({ a: 1, b: 2, c: 3 }, (_key, value) => value > 1);
    expect(result).toBe('b=2&c=3');
  });

  it('returns empty string when all values are undefined', () => {
    const result = getSearchQuery({
      a: undefined as unknown,
      b: undefined as unknown,
    });
    expect(result).toBe('');
  });
});

describe('compare', () => {
  it('returns true for identical primitives', () => {
    expect(compare(1, 1)).toBe(true);
    expect(compare('a', 'a')).toBe(true);
    expect(compare(true, true)).toBe(true);
  });

  it('returns false for different primitives', () => {
    expect(compare(1, 2)).toBe(false);
    expect(compare('a', 'b')).toBe(false);
  });

  it('returns true for equal flat arrays', () => {
    expect(compare([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it('returns false for arrays of different length', () => {
    expect(compare([1, 2], [1, 2, 3])).toBe(false);
  });

  it('returns false for arrays with different elements', () => {
    expect(compare([1, 2], [1, 3])).toBe(false);
  });

  it('handles nested arrays', () => {
    expect(compare([[1, 2], [3]], [[1, 2], [3]])).toBe(true);
    expect(compare([[1, 2], [3]], [[1, 2], [4]])).toBe(false);
  });

  it('returns true for equal flat objects', () => {
    expect(compare({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
  });

  it('returns false for objects with different keys', () => {
    expect(compare({ a: 1 }, { b: 1 })).toBe(false);
  });

  it('returns false for objects with different number of keys', () => {
    expect(compare({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it('handles nested objects', () => {
    expect(compare({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
    expect(compare({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
  });

  it('returns false when comparing array with object', () => {
    expect(compare([1], { 0: 1 })).toBe(false);
  });

  it('handles null and undefined', () => {
    expect(compare(null, null)).toBe(true);
    expect(compare(undefined, undefined)).toBe(true);
    expect(compare(null, undefined)).toBe(false);
    expect(compare(null, 0)).toBe(false);
  });

  it('returns true for same reference', () => {
    const obj = { x: 1 };
    expect(compare(obj, obj)).toBe(true);
  });
});

describe('formatDate', () => {
  it('formats a normal date with zero-padded month and day', () => {
    expect(formatDate(2024, 1, 5)).toBe('2024-01-05');
  });

  it('formats a double-digit month and day', () => {
    expect(formatDate(2024, 12, 25)).toBe('2024-12-25');
  });

  it('handles month overflow (day 31 of 30-day month)', () => {
    const result = formatDate(2024, 4, 31);
    expect(result).toBe('2024-05-01');
  });

  it('handles February 29 on a leap year', () => {
    expect(formatDate(2024, 2, 29)).toBe('2024-02-29');
  });

  it('handles February 29 on a non-leap year (overflows to March)', () => {
    expect(formatDate(2023, 2, 29)).toBe('2023-03-01');
  });
});

describe('downloadContent', () => {
  let appendChildSpy: jest.SpyInstance;
  let createElementSpy: jest.SpyInstance;
  let mockAnchor: {
    href: string;
    download: string;
    click: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(() => {
    mockAnchor = {
      href: '',
      download: '',
      click: jest.fn(),
      remove: jest.fn(),
    };

    createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockReturnValue(mockAnchor as unknown as HTMLElement);

    appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation((node) => node);

    window.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    window.URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
  });

  it('creates an anchor, clicks it, and removes it', () => {
    const blob = new Blob(['test'], { type: 'text/plain' });
    downloadContent(blob, 'report.csv');

    expect(window.URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(mockAnchor.href).toBe('blob:mock-url');
    expect(mockAnchor.download).toBe('report.csv');
    expect(document.body.appendChild).toHaveBeenCalledWith(mockAnchor);
    expect(mockAnchor.click).toHaveBeenCalled();
    expect(mockAnchor.remove).toHaveBeenCalled();
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('uses default filename when none is provided', () => {
    const blob = new Blob(['data']);
    downloadContent(blob);

    expect(mockAnchor.download).toBe('nda-download-content');
  });
});
