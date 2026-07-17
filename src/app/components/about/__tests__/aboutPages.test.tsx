import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

import Founders from '../../aboutFounders/Founders';
import Journey from '../../aboutJourney/Journey';
import Mission from '../../aboutMission/Mission';
import Values from '../../aboutValues/Values';
import Vision from '../../aboutVision/Vision';

describe('Founders', () => {
  it('renders founders section', () => {
    render(<Founders />);
    expect(screen.getByText('Meet Our Founders')).toBeInTheDocument();
    expect(screen.getByText('Will Wheeler')).toBeInTheDocument();
    expect(screen.getByText('Pratik Bhumkar')).toBeInTheDocument();
  });
});

describe('Journey', () => {
  it('renders journey section', () => {
    render(<Journey />);
    expect(screen.getByText('Our Journey')).toBeInTheDocument();
    expect(
      screen.getByText(/Founder Will Wheeler, as a neurodistinct individual/),
    ).toBeInTheDocument();
  });
});

describe('Mission', () => {
  it('renders mission section', () => {
    render(<Mission />);
    expect(screen.getByText('Our Mission')).toBeInTheDocument();
    expect(
      screen.getByText(/To connect Neurodivergent people with the right education/),
    ).toBeInTheDocument();
  });
});

describe('Values', () => {
  it('renders core values', () => {
    render(<Values />);
    expect(screen.getByText('Core Values')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('Respect')).toBeInTheDocument();
    expect(screen.getByText('Safety')).toBeInTheDocument();
    expect(screen.getByText('Innovation')).toBeInTheDocument();
    expect(screen.getByText('Fun')).toBeInTheDocument();
    expect(screen.getByText('Leadership')).toBeInTheDocument();
  });
});

describe('Vision', () => {
  it('renders vision section', () => {
    render(<Vision />);
    expect(screen.getByText('Our Vision')).toBeInTheDocument();
    expect(
      screen.getByText(/To set the standard around Neurodiversity/),
    ).toBeInTheDocument();
  });
});
