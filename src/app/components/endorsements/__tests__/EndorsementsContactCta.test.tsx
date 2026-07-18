import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('@/app/utilities/gaTracking', () => ({
  sendContactCtaClickEvent: jest.fn(),
}));

jest.mock('@/app/utilities/metaPixelTracking', () => ({
  sendMetaContactCtaLeadEvent: jest.fn(),
}));

import EndorsementsContactCta from '../EndorsementsContactCta';
import { sendContactCtaClickEvent } from '@/app/utilities/gaTracking';
import { sendMetaContactCtaLeadEvent } from '@/app/utilities/metaPixelTracking';
import { ENDORSEMENTS_CTA_LABELS } from '@/app/utilities/constants';

const mockSendContactCtaClickEvent = sendContactCtaClickEvent as jest.Mock;
const mockSendMetaContactCtaLeadEvent = sendMetaContactCtaLeadEvent as jest.Mock;

describe('EndorsementsContactCta', () => {
  beforeEach(() => {
    mockSendContactCtaClickEvent.mockClear();
    mockSendMetaContactCtaLeadEvent.mockClear();
  });

  it('renders contact CTA label', () => {
    render(<EndorsementsContactCta />);
    expect(screen.getByText(ENDORSEMENTS_CTA_LABELS.CONTACT)).toBeInTheDocument();
  });

  it('tracks GA and Meta Lead on click', () => {
    render(<EndorsementsContactCta />);
    fireEvent.click(screen.getByText(ENDORSEMENTS_CTA_LABELS.CONTACT));
    expect(mockSendContactCtaClickEvent).toHaveBeenCalledWith('/contact', 'endorsements_faq');
    expect(mockSendMetaContactCtaLeadEvent).toHaveBeenCalled();
  });
});
