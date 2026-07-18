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

import Advisors from '../Advisors';

describe('Advisors', () => {
  beforeEach(() => {
    window.open = jest.fn();
  });

  it('renders advisor section headings', () => {
    render(<Advisors />);
    expect(screen.getByText('Meet Our Business Advisors')).toBeInTheDocument();
    expect(screen.getByText('Meet Our Event Advisors')).toBeInTheDocument();
    expect(screen.getByText('Meet Our Academic Advisors')).toBeInTheDocument();
  });

  it('renders advisor names and companies', () => {
    render(<Advisors />);
    expect(screen.getByText('Peter Haasz')).toBeInTheDocument();
    expect(screen.getByText('Haasz Advisory')).toBeInTheDocument();
    expect(screen.getByText('Jason Wong')).toBeInTheDocument();
    expect(screen.getByText('Dr Natasha Arthars')).toBeInTheDocument();
  });

  it('renders profile photos with alt text', () => {
    render(<Advisors />);
    expect(screen.getByAltText('Peter Haasz photo')).toBeInTheDocument();
    expect(screen.getByAltText('Jan Croeni photo')).toBeInTheDocument();
  });

  it('opens LinkedIn profile when icon is clicked', () => {
    render(<Advisors />);
    const linkedinIcons = screen.getAllByAltText('LinkedIn icon');
    fireEvent.click(linkedinIcons[0]);
    expect(window.open).toHaveBeenCalledWith('https://www.linkedin.com/in/peterhaasz', '_blank');
  });
});
