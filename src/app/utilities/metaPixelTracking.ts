import { CONVERSION_FORM_NAMES, META_EVENTS } from '@/app/utilities/constants';

export type MetaEventParams = Record<string, string>;

type FbqFn = (...args: Array<string | MetaEventParams>) => void;

interface FbqWindow extends Window {
  fbq?: FbqFn;
}

function resolveFbq(): FbqFn | null {
  const candidate = (window as FbqWindow).fbq;
  if (typeof candidate === 'function') {
    return candidate;
  }
  return null;
}

export function sendMetaEvent(eventName: string, params?: MetaEventParams): void {
  const fbq = resolveFbq();
  if (fbq === null) {
    return;
  }

  if (params === undefined) {
    fbq('track', eventName);
    return;
  }

  fbq('track', eventName, params);
}

export function sendMetaContactLeadEvent(): void {
  sendMetaEvent(META_EVENTS.LEAD, { content_name: CONVERSION_FORM_NAMES.CONTACT_US });
}

export function sendMetaNewsletterSubscribeEvent(): void {
  sendMetaEvent(META_EVENTS.SUBSCRIBE);
}

export function sendMetaHandbookDownloadEvent(): void {
  sendMetaEvent(META_EVENTS.COMPLETE_REGISTRATION, {
    content_name: CONVERSION_FORM_NAMES.HANDBOOK,
  });
}
