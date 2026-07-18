import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import Teacher from '../Teacher';

describe('Teacher', () => {
  let windowOpenSpy: jest.SpyInstance;

  beforeEach(() => {
    windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
  });

  afterEach(() => {
    windowOpenSpy.mockRestore();
  });

  it('renders the section heading', () => {
    render(<Teacher />);
    const headings = screen.getAllByText(/Introduction to Neurodiversity in VET/);
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the body description text', () => {
    render(<Teacher />);
    expect(screen.getByText(/VET educators, trainers, assessors/)).toBeInTheDocument();
  });

  it('renders an Enrol Now button', () => {
    render(<Teacher />);
    expect(screen.getByText('Enrol Now')).toBeInTheDocument();
  });

  it('opens vetr.com.au in a new tab on Enrol Now click', () => {
    render(<Teacher />);
    fireEvent.click(screen.getByText('Enrol Now'));
    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://www.vetr.com.au/visitor_catalog_class/show/1730848',
      '_blank',
      'noopener,noreferrer',
    );
  });
});
