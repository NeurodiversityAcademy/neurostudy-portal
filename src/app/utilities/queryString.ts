// A short implementation to work with search query, inspired by the `qs` library.
'use client';

type RecordType = string | number | boolean | undefined | null;

const queryString = {
  stringify: (
    record: Record<string, RecordType | RecordType[]>,
    config: Partial<{
      useLocationSearch: boolean;
      addDelimiter: boolean;
    }> = {}
  ) => {
    const { useLocationSearch = false, addDelimiter = true } = config;

    const searchParams = new URLSearchParams(
      useLocationSearch ? location.search : ''
    );

    for (const key in record) {
      const value = record[key];
      if (Array.isArray(value)) {
        searchParams.delete(key);
        value.forEach((item) => {
          searchParams.append(key, encodeURIComponent(String(item)));
        });
      } else if (value === undefined) {
        searchParams.delete(key);
      } else {
        searchParams.set(key, encodeURIComponent(String(value)));
      }
    }

    const newSearch = searchParams.toString();

    return newSearch && addDelimiter ? '?' + newSearch : newSearch;
  },
  parse: (value: string = window.location.search) => {
    const searchParams = new URLSearchParams(value);

    const obj: Record<string, string | string[]> = {};

    searchParams.forEach((value, key) => {
      value = decodeURIComponent(value);
      if (key in obj) {
        const prevValue = obj[key];
        if (!Array.isArray(prevValue)) {
          obj[key] = [prevValue];
        }

        Array.isArray(obj[key]) && (obj[key] as string[]).push(value);

      } else {
        obj[key] = value;
      }
    });

    return obj;
  },
};

export default queryString;
