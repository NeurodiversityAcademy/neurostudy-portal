import { fireEvent, render } from '@testing-library/react';
import Accordion from '../Accordian';
import { ACCORDION_TRACKING_DISABLED } from '@/app/utilities/accordionActions';
import {
  GA_EVENT_COMMAND,
  installGtagMock,
  installTestPagePath,
} from '@/app/utilities/__tests__/gaTestHelpers';

jest.mock('@/app/components/images/ArrowDown', () => ({
  __esModule: true,
  default: () => <span>arrow</span>,
}));

describe('Accordion analytics', () => {
  let mockGtag: jest.Mock;

  beforeEach(() => {
    mockGtag = installGtagMock();
    installTestPagePath('/endorsedproviders/collarts');
  });

  it('does not fire gtag when accordionToggleLabel is disabled', () => {
    const { getByRole } = render(
      <Accordion
        title='Question without analytics'
        accordionToggleLabel={ACCORDION_TRACKING_DISABLED}
      >
        <p>Answer</p>
      </Accordion>,
    );

    fireEvent.click(getByRole('button'));
    expect(mockGtag).not.toHaveBeenCalled();
  });

  it('fires gtag when accordion is expanded with tracking label', () => {
    const label = 'What support is available?';
    const { getByRole } = render(
      <Accordion title={label} accordionToggleLabel={label}>
        <p>Answer</p>
      </Accordion>,
    );

    fireEvent.click(getByRole('button'));

    expect(mockGtag).toHaveBeenCalledWith(GA_EVENT_COMMAND, 'accordion_toggle', {
      accordion_title: label,
      category: 'Content',
      page_path: '/endorsedproviders/collarts',
    });
  });

  it('does not fire gtag when accordion is collapsed', () => {
    const label = 'Collapse test';
    const { getByRole } = render(
      <Accordion title={label} accordionToggleLabel={label}>
        <p>Answer</p>
      </Accordion>,
    );

    const button = getByRole('button');
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockGtag).toHaveBeenCalledTimes(1);
  });

  it('does not fire gtag on mount when startExpanded is true', () => {
    const label = 'Pre-expanded';
    render(
      <Accordion title={label} startExpanded accordionToggleLabel={label}>
        <p>Answer</p>
      </Accordion>,
    );

    expect(mockGtag).not.toHaveBeenCalled();
  });
});
