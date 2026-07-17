import xss, { getDefaultWhiteList } from 'xss';
import type { IFilterXSSOptions, IWhiteList } from 'xss';

export interface SanitizeHtmlOptions {
  allowIframes?: boolean;
  allowTargetAttr?: boolean;
}

const IFRAME_ATTRIBUTES = [
  'src',
  'width',
  'height',
  'allow',
  'allowfullscreen',
  'frameborder',
  'scrolling',
  'title',
  'referrerpolicy',
];

const ALLOWED_IFRAME_HOST_PATTERN =
  /^(https?:)?\/\/(www\.)?(youtube\.com|youtube-nocookie\.com|player\.vimeo\.com)\//i;

/**
 * Server-safe HTML sanitizer (no jsdom). Replaces isomorphic-dompurify so
 * Vercel/Lambda SSR never loads ESM-only jsdom transitive deps.
 */
export const sanitizeHtml = (
  dirty: string | undefined | null,
  options: SanitizeHtmlOptions = {},
): string => {
  if (!dirty) {
    return '';
  }

  const { allowIframes = false, allowTargetAttr = false } = options;
  const whiteList: IWhiteList = { ...getDefaultWhiteList() };

  if (allowIframes) {
    whiteList.iframe = IFRAME_ATTRIBUTES;
  }

  if (allowTargetAttr && whiteList.a) {
    whiteList.a = Array.from(new Set([...whiteList.a, 'target', 'rel']));
  }

  const filterOptions: IFilterXSSOptions = {
    whiteList,
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style'],
  };

  if (allowIframes) {
    filterOptions.onTagAttr = (tag, name, value) => {
      if (tag === 'iframe' && name === 'src' && !ALLOWED_IFRAME_HOST_PATTERN.test(value)) {
        return '';
      }
      return undefined;
    };
  }

  return xss(dirty, filterOptions);
};
