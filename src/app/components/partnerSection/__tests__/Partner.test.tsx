import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { src, alt, ...rest } = props;
    const imgSrc =
      typeof src === 'object' && src !== null
        ? (src as { src?: string }).src || ''
        : String(src || '');
    return <img {...rest} src={imgSrc} alt={alt as string} />;
  },
}));

const mockScrollPrev = jest.fn();
const mockScrollNext = jest.fn();

jest.mock('embla-carousel-react', () => ({
  __esModule: true,
  default: () => [
    jest.fn(),
    {
      scrollPrev: mockScrollPrev,
      scrollNext: mockScrollNext,
    },
  ],
}));

import Partner from '../Partner';

describe('Partner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders section heading', () => {
    render(<Partner />);
    expect(screen.getByText('Leading organisations supporting us')).toBeInTheDocument();
  });

  it('renders partner logos', () => {
    render(<Partner />);
    expect(screen.getByAltText('Inclusive Change')).toBeInTheDocument();
    expect(screen.getByAltText('Grit and Flow')).toBeInTheDocument();
    expect(screen.getByAltText('Tech Diversity')).toBeInTheDocument();
    expect(screen.getByAltText('Unify 360')).toBeInTheDocument();
  });

  it('renders partner links', () => {
    render(<Partner />);
    expect(screen.getByRole('link', { name: /Inclusive Change/i })).toHaveAttribute(
      'href',
      'https://inc-change.com/',
    );
    expect(screen.getByRole('link', { name: /Grit and Flow/i })).toHaveAttribute(
      'href',
      'https://www.gritandflow.com/',
    );
  });

  it('scrolls carousel when navigation buttons are clicked', () => {
    render(<Partner />);
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    expect(mockScrollPrev).toHaveBeenCalledTimes(1);
    expect(mockScrollNext).toHaveBeenCalledTimes(1);
  });
});
