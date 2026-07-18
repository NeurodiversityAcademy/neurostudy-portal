import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('next/image', () => require('@/testUtils/mockNextImage'));

jest.mock('@/app/hooks/useHideOverflowEffect', () => ({
  __esModule: true,
  default: () => () => () => {},
}));

jest.mock('@/app/utilities/register/registerSubscriptionData', () => ({
  registerSubscriptionData: jest.fn().mockResolvedValue({ id: 'sub-1' }),
}));

jest.mock('@/app/utilities/common', () => ({
  notifyError: jest.fn(),
}));

jest.mock('@/app/utilities/gaTracking', () => ({
  sendHandbookCtaClickEvent: jest.fn(),
}));

jest.mock('@/app/utilities/metaPixelTracking', () => ({
  sendMetaHandbookCtaLeadEvent: jest.fn(),
}));

import Handbook from '../index';
import { ENDORSEMENTS_CTA_LABELS } from '@/app/utilities/constants';
import { sendHandbookCtaClickEvent } from '@/app/utilities/gaTracking';
import { sendMetaHandbookCtaLeadEvent } from '@/app/utilities/metaPixelTracking';

const mockSendHandbookCtaClickEvent = sendHandbookCtaClickEvent as jest.Mock;
const mockSendMetaHandbookCtaLeadEvent = sendMetaHandbookCtaLeadEvent as jest.Mock;

describe('Handbook', () => {
  beforeEach(() => {
    mockSendHandbookCtaClickEvent.mockClear();
    mockSendMetaHandbookCtaLeadEvent.mockClear();
  });

  it('renders handbook heading and description', () => {
    render(<Handbook />);
    expect(screen.getByText('Neuro-Inclusion in Vocational Education')).toBeInTheDocument();
    expect(
      screen.getByText(/Download our free handbook for practical strategies/),
    ).toBeInTheDocument();
  });

  it('renders handbook images', () => {
    render(<Handbook />);
    expect(screen.getByAltText('Handbook Sample Graph')).toBeInTheDocument();
    expect(screen.getByAltText('Handbook Mobile Screenshot')).toBeInTheDocument();
  });

  it('opens popup and tracks CTA click when handbook button is clicked', () => {
    render(<Handbook />);
    fireEvent.click(screen.getByText(ENDORSEMENTS_CTA_LABELS.HANDBOOK));
    expect(mockSendHandbookCtaClickEvent).toHaveBeenCalledWith('handbook');
    expect(mockSendMetaHandbookCtaLeadEvent).toHaveBeenCalled();
    expect(screen.getByText('Subscribe to our Newsletter!')).toBeInTheDocument();
  });

  it('has handbook container id', () => {
    const { container } = render(<Handbook />);
    expect(container.querySelector('#handbook-container')).toBeInTheDocument();
  });
});
