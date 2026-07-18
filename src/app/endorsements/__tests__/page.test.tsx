import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/image', () => require('@/testUtils/mockNextImage'));

jest.mock(
  '../../components/bannerStudents/HomeBanner',
  () => require('@/testUtils/mockPageSectionStubs').mockHomeBanner,
);
jest.mock(
  '../../components/teacherSection/Teacher',
  () => require('@/testUtils/mockPageSectionStubs').mockTeacher,
);
jest.mock(
  '../../components/handbook',
  () => require('@/testUtils/mockPageSectionStubs').mockHandbook,
);
jest.mock('../../components/fact/Fact', () => require('@/testUtils/mockPageSectionStubs').mockFact);
jest.mock(
  '../../components/endorsements/EndorsementProcess',
  () => require('@/testUtils/mockPageSectionStubs').mockEndorsementProcess,
);
jest.mock(
  '../../components/partnerSection/Partner',
  () => require('@/testUtils/mockPageSectionStubs').mockPartner,
);
jest.mock(
  '../../components/podcast/DisplayPodcast',
  () => require('@/testUtils/mockPageSectionStubs').mockDisplayPodcast,
);
jest.mock(
  '../../components/articleList/articleList',
  () => require('@/testUtils/mockPageSectionStubs').mockArticleList,
);
jest.mock(
  '../../components/subscribe/subscribe',
  () => require('@/testUtils/mockPageSectionStubs').mockSubscribe,
);
jest.mock('../../components/accordion/Accordian', () => require('@/testUtils/mockAccordion'));

jest.mock('../../components/endorsements/EndorsementsContactCta', () => ({
  __esModule: true,
  default: () => {
    const { ENDORSEMENTS_CTA_LABELS } = require('@/app/utilities/constants');
    return <a href='/contact'>{ENDORSEMENTS_CTA_LABELS.CONTACT}</a>;
  },
}));

import Page from '../page';
import { ENDORSEMENTS_CTA_LABELS } from '@/app/utilities/constants';

describe('Endorsements page', () => {
  it('renders live endorsed organisations', () => {
    render(<Page />);

    expect(screen.getByText('NDA Endorsed Providers')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Explore More' })).toHaveLength(4);
  });

  it('renders tracked contact CTA below FAQs', () => {
    render(<Page />);

    expect(screen.getByRole('link', { name: ENDORSEMENTS_CTA_LABELS.CONTACT })).toHaveAttribute(
      'href',
      '/contact',
    );
  });
});
