import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/image', () => require('@/testUtils/mockNextImage'));

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

jest.mock('../../components/aboutJourney/Journey', () => ({
  __esModule: true,
  default: () => <div>Journey</div>,
}));
jest.mock('../../components/aboutValues/Values', () => ({
  __esModule: true,
  default: () => <div>Values</div>,
}));
jest.mock('../../components/aboutVision/Vision', () => ({
  __esModule: true,
  default: () => <div>Vision</div>,
}));
jest.mock('../../components/aboutMission/Mission', () => ({
  __esModule: true,
  default: () => <div>Mission</div>,
}));
jest.mock('../../components/aboutFounders/Founders', () => ({
  __esModule: true,
  default: () => <div>Founders</div>,
}));
jest.mock('../../components/aboutAdvisors/Advisors', () => ({
  __esModule: true,
  default: () => <div>Advisors</div>,
}));

import Page from '../page';

describe('About page', () => {
  it('links to endorsements and contact', () => {
    render(<Page />);

    expect(screen.getByRole('link', { name: 'endorsement program' })).toHaveAttribute(
      'href',
      '/endorsements',
    );
    expect(screen.getByRole('link', { name: 'contact us' })).toHaveAttribute('href', '/contact');
  });
});
