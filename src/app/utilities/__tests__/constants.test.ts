import { GA_EVENTS } from '../constants';

describe('GA_EVENTS', () => {
  it('has exactly 5 event definitions', () => {
    const keys = Object.keys(GA_EVENTS);
    expect(keys).toHaveLength(5);
    expect(keys).toEqual([
      'SCROLL_DEPTH',
      'SECTION_VISIBLE',
      'TIME_ON_PAGE',
      'ACCORDION_TOGGLE',
      'ENDORSED_EXPLORE_CLICK',
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
  });
});
