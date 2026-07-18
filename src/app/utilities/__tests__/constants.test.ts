import { CONVERSION_FORM_NAMES, GA_EVENTS, META_EVENTS } from '../constants';

describe('GA_EVENTS', () => {
  it('has exactly 8 event definitions', () => {
    const keys = Object.keys(GA_EVENTS);
    expect(keys).toHaveLength(8);
    expect(keys).toEqual([
      'SCROLL_DEPTH',
      'SECTION_VISIBLE',
      'TIME_ON_PAGE',
      'ACCORDION_TOGGLE',
      'ENDORSED_EXPLORE_CLICK',
      'CONTACT_SUBMIT',
      'NEWSLETTER_SUBSCRIBE',
      'HANDBOOK_DOWNLOAD',
    ]);
  });

  it('each entry has eventName and category as strings', () => {
    for (const value of Object.values(GA_EVENTS)) {
      expect(typeof value.eventName).toBe('string');
      expect(typeof value.category).toBe('string');
    }
  });

  it('has expected event name values', () => {
    expect(GA_EVENTS.SCROLL_DEPTH.eventName).toBe('scroll_depth');
    expect(GA_EVENTS.SECTION_VISIBLE.eventName).toBe('section_visible');
    expect(GA_EVENTS.TIME_ON_PAGE.eventName).toBe('time_on_page');
    expect(GA_EVENTS.ACCORDION_TOGGLE.eventName).toBe('accordion_toggle');
    expect(GA_EVENTS.ENDORSED_EXPLORE_CLICK.eventName).toBe('endorsed_explore_click');
    expect(GA_EVENTS.CONTACT_SUBMIT.eventName).toBe('contact_submit');
    expect(GA_EVENTS.NEWSLETTER_SUBSCRIBE.eventName).toBe('newsletter_subscribe');
    expect(GA_EVENTS.HANDBOOK_DOWNLOAD.eventName).toBe('handbook_download');
  });
});

describe('META_EVENTS', () => {
  it('has expected Meta standard event names', () => {
    expect(META_EVENTS.LEAD).toBe('Lead');
    expect(META_EVENTS.SUBSCRIBE).toBe('Subscribe');
    expect(META_EVENTS.COMPLETE_REGISTRATION).toBe('CompleteRegistration');
  });
});

describe('CONVERSION_FORM_NAMES', () => {
  it('has expected form name values', () => {
    expect(CONVERSION_FORM_NAMES.CONTACT_US).toBe('contact_us');
    expect(CONVERSION_FORM_NAMES.NEWSLETTER).toBe('newsletter');
    expect(CONVERSION_FORM_NAMES.HANDBOOK).toBe('handbook');
  });
});
