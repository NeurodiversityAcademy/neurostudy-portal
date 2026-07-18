import {
  sendMetaContactCtaLeadEvent,
  sendMetaEvent,
  sendMetaHandbookCtaLeadEvent,
} from '@/app/utilities/metaPixelTracking';
import { CONVERSION_CTA_NAMES, META_EVENTS } from '@/app/utilities/constants';

type FbqTestWindow = Window & {
  fbq?: jest.Mock;
};

describe('metaPixelTracking', () => {
  const mockFbq = jest.fn();

  beforeEach(() => {
    mockFbq.mockClear();
    (window as FbqTestWindow).fbq = mockFbq;
  });

  afterEach(() => {
    delete (window as FbqTestWindow).fbq;
  });

  it('sendMetaEvent is a no-op when fbq is missing', () => {
    delete (window as FbqTestWindow).fbq;
    expect(() => sendMetaEvent(META_EVENTS.LEAD)).not.toThrow();
  });

  it('sendMetaHandbookCtaLeadEvent tracks Lead with handbook cta content_name', () => {
    sendMetaHandbookCtaLeadEvent();
    expect(mockFbq).toHaveBeenCalledWith('track', META_EVENTS.LEAD, {
      content_name: `${CONVERSION_CTA_NAMES.HANDBOOK}_cta`,
    });
  });

  it('sendMetaContactCtaLeadEvent tracks Lead with contact cta content_name', () => {
    sendMetaContactCtaLeadEvent();
    expect(mockFbq).toHaveBeenCalledWith('track', META_EVENTS.LEAD, {
      content_name: `${CONVERSION_CTA_NAMES.CONTACT}_cta`,
    });
  });
});
