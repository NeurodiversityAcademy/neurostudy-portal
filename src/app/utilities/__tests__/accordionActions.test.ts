import {
  ACCORDION_NO_EXPAND_ACTION,
  createAccordionExpandHandler,
} from '@/app/utilities/accordionActions';
import { GA_EVENTS } from '@/app/utilities/constants';
import {
  installGtagMock,
  installTestPagePath,
} from '@/app/utilities/__tests__/gaTestHelpers';

describe('accordionActions', () => {
  beforeEach(() => {
    installTestPagePath('/endorsedproviders/collarts');
  });

  it('createAccordionExpandHandler dispatches accordion_toggle on invoke', () => {
    const mockGtag = installGtagMock();
    const label = 'What support is available?';
    const handler = createAccordionExpandHandler(label);
    handler();
    expect(mockGtag).toHaveBeenCalledWith(
      'event',
      GA_EVENTS.ACCORDION_TOGGLE.eventName,
      {
        accordion_title: label,
        category: GA_EVENTS.ACCORDION_TOGGLE.category,
        page_path: '/endorsedproviders/collarts',
      }
    );
  });

  it('ACCORDION_NO_EXPAND_ACTION does not throw', () => {
    expect(() => ACCORDION_NO_EXPAND_ACTION()).not.toThrow();
  });
});
