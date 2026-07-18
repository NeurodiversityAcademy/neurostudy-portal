import {
  CONVERSION_CTA_NAMES,
  ENDORSEMENTS_CTA_LABELS,
  GA_EVENTS,
  META_EVENTS,
} from '../constants';

describe('GA_EVENTS', () => {
  it('has exactly 7 event definitions', () => {
    const keys = Object.keys(GA_EVENTS);
    expect(keys).toHaveLength(7);
    expect(keys).toEqual([
      'SCROLL_DEPTH',
      'SECTION_VISIBLE',
      'TIME_ON_PAGE',
      'ACCORDION_TOGGLE',
      'ENDORSED_EXPLORE_CLICK',
      'HANDBOOK_CTA_CLICK',
      'CONTACT_CTA_CLICK',
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
    expect(GA_EVENTS.HANDBOOK_CTA_CLICK.eventName).toBe('handbook_cta_click');
    expect(GA_EVENTS.CONTACT_CTA_CLICK.eventName).toBe('contact_cta_click');
  });
});

describe('conversion CTA constants', () => {
  it('exposes endorsement CTA labels', () => {
    expect(ENDORSEMENTS_CTA_LABELS.HANDBOOK).toBe('Get the free handbook');
    expect(ENDORSEMENTS_CTA_LABELS.CONTACT).toBe('Contact us about endorsement');
  });

  it('exposes conversion CTA names for Meta content_name', () => {
    expect(CONVERSION_CTA_NAMES.HANDBOOK).toBe('handbook');
    expect(CONVERSION_CTA_NAMES.CONTACT).toBe('contact_us');
  });

  it('exposes Meta Lead event name', () => {
    expect(META_EVENTS.LEAD).toBe('Lead');
  });
});
