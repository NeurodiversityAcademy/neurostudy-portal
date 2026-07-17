import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { src, ...rest } = props;
    const imgSrc =
      typeof src === 'object' && src !== null
        ? (src as { src?: string }).src || ''
        : String(src || '');
    return <img {...rest} src={imgSrc} />;
  },
}));

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

import Handbook from '../index';

describe('Handbook', () => {
  it('renders handbook heading and description', () => {
    render(<Handbook />);
    expect(
      screen.getByText('Neuro-Inclusion in Vocational Education'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Explore key strategies for building neuro-inclusive/),
    ).toBeInTheDocument();
  });

  it('renders handbook images', () => {
    render(<Handbook />);
    expect(screen.getByAltText('Handbook Sample Graph')).toBeInTheDocument();
    expect(screen.getByAltText('Handbook Mobile Screenshot')).toBeInTheDocument();
  });

  it('opens popup when Free Download is clicked', () => {
    render(<Handbook />);
    fireEvent.click(screen.getByText('Free Download'));
    expect(
      screen.getByText('Subscribe to our Newsletter!'),
    ).toBeInTheDocument();
  });

  it('has handbook container id', () => {
    const { container } = render(<Handbook />);
    expect(container.querySelector('#handbook-container')).toBeInTheDocument();
  });
});
