import React from 'react';
import { render, screen } from '@testing-library/react';

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

jest.mock('isomorphic-dompurify', () => ({
  __esModule: true,
  default: { sanitize: (html: string) => html },
}));

import CourseDetailsBodyText from '../CourseDetailsBodyText';

describe('CourseDetailsBodyText', () => {
  it('renders sanitized paragraph content', () => {
    render(<CourseDetailsBodyText id='overview' data={'First paragraph\nSecond paragraph'} />);

    expect(screen.getByText('First paragraph')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph')).toBeInTheDocument();
  });

  it('renders tuition fees button only for tuitionFees id', () => {
    render(<CourseDetailsBodyText id='tuitionFees' data={'Fee details here'} />);

    expect(screen.getByText('Fee details here')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view tuition fees/i })).toBeInTheDocument();
  });

  it('does not render tuition fees button for other ids', () => {
    render(<CourseDetailsBodyText id='overview' data={'Overview text'} />);

    expect(screen.queryByRole('button', { name: /view tuition fees/i })).not.toBeInTheDocument();
  });

  it('handles undefined data gracefully', () => {
    const { container } = render(<CourseDetailsBodyText id='overview' data={undefined} />);

    expect(container.querySelector('#overview')).toBeInTheDocument();
    expect(container.querySelector('#overview')?.childNodes.length).toBe(0);
  });
});
