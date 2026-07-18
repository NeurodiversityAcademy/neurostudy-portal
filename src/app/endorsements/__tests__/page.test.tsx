import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: { alt?: string }) => <img alt={props.alt ?? ''} />,
}));

jest.mock('../../components/bannerStudents/HomeBanner', () => ({
  __esModule: true,
  default: () => <div data-testid='home-banner' />,
}));

jest.mock('../../components/teacherSection/Teacher', () => ({
  __esModule: true,
  default: () => <div data-testid='teacher' />,
}));

jest.mock('../../components/handbook', () => ({
  __esModule: true,
  default: () => <div data-testid='handbook' />,
}));

jest.mock('../../components/fact/Fact', () => ({
  __esModule: true,
  default: () => <div data-testid='fact' />,
}));

jest.mock('../../components/endorsements/EndorsementProcess', () => ({
  __esModule: true,
  default: () => <div data-testid='endorsement-process' />,
}));

jest.mock('../../components/partnerSection/Partner', () => ({
  __esModule: true,
  default: () => <div data-testid='partner' />,
}));

jest.mock('../../components/podcast/DisplayPodcast', () => ({
  __esModule: true,
  default: () => <div data-testid='podcast' />,
}));

jest.mock('../../components/articleList/articleList', () => ({
  __esModule: true,
  default: () => <div data-testid='article-list' />,
}));

jest.mock('../../components/subscribe/subscribe', () => ({
  __esModule: true,
  default: () => <div data-testid='subscribe' />,
}));

jest.mock('../../components/accordion/Accordian', () => ({
  __esModule: true,
  default: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div data-testid='accordion'>
      <h3>{title}</h3>
      {children}
    </div>
  ),
}));

import Page from '../page';

describe('Endorsements page', () => {
  it('renders live endorsed organisations', () => {
    render(<Page />);

    expect(screen.getByText('NDA Endorsed Providers')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Explore More' })).toHaveLength(4);
  });
});
