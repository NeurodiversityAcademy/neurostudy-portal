import { CONVERSION_FORM_NAMES, META_EVENTS } from '@/app/utilities/constants';
import {
  sendMetaContactLeadEvent,
  sendMetaEvent,
  sendMetaHandbookDownloadEvent,
  sendMetaNewsletterSubscribeEvent,
} from '@/app/utilities/metaPixelTracking';

interface FbqTestWindow extends Window {
  fbq?: jest.Mock;
}

function installFbqMock(): jest.Mock {
  const mockFbq = jest.fn();
  (window as FbqTestWindow).fbq = mockFbq;
  return mockFbq;
}

describe('metaPixelTracking', () => {
  afterEach(() => {
    delete (window as FbqTestWindow).fbq;
  });

  it('sendMetaEvent is a no-op when fbq is missing', () => {
    delete (window as FbqTestWindow).fbq;
    expect(() => sendMetaEvent(META_EVENTS.LEAD)).not.toThrow();
  });

  it('sendMetaEvent tracks event without params', () => {
    const mockFbq = installFbqMock();
    sendMetaEvent(META_EVENTS.SUBSCRIBE);
    expect(mockFbq).toHaveBeenCalledWith('track', META_EVENTS.SUBSCRIBE);
  });

  it('sendMetaEvent tracks event with params', () => {
    const mockFbq = installFbqMock();
    sendMetaEvent(META_EVENTS.LEAD, { content_name: 'contact_us' });
    expect(mockFbq).toHaveBeenCalledWith('track', META_EVENTS.LEAD, {
      content_name: 'contact_us',
    });
  });

  it('sendMetaContactLeadEvent tracks Lead with content_name', () => {
    const mockFbq = installFbqMock();
    sendMetaContactLeadEvent();
    expect(mockFbq).toHaveBeenCalledWith('track', META_EVENTS.LEAD, {
      content_name: CONVERSION_FORM_NAMES.CONTACT_US,
    });
  });

  it('sendMetaNewsletterSubscribeEvent tracks Subscribe', () => {
    const mockFbq = installFbqMock();
    sendMetaNewsletterSubscribeEvent();
    expect(mockFbq).toHaveBeenCalledWith('track', META_EVENTS.SUBSCRIBE);
  });

  it('sendMetaHandbookDownloadEvent tracks CompleteRegistration with handbook content_name', () => {
    const mockFbq = installFbqMock();
    sendMetaHandbookDownloadEvent();
    expect(mockFbq).toHaveBeenCalledWith('track', META_EVENTS.COMPLETE_REGISTRATION, {
      content_name: CONVERSION_FORM_NAMES.HANDBOOK,
    });
  });
});
