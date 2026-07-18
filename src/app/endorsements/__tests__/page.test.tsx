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

import Page from '../page';

describe('Endorsements page', () => {
  it('renders live endorsed organisations', () => {
    render(<Page />);

    expect(screen.getByText('NDA Endorsed Providers')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Explore More' })).toHaveLength(4);
  });
});
