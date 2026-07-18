import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('@/app/components/accordion/Accordian', () => require('@/testUtils/mockAccordion'));

import EndorsedProvidersFAQs from '../EndorsedProvidersFAQs';
import type { EndorsedFaqSection } from '../endorsedProviderPageData';

const faqSections: EndorsedFaqSection[] = [
  {
    sectionTitle: 'About the Endorsement',
    items: [
      {
        question: 'What does endorsement mean?',
        answer: 'It means the provider meets NDA standards.',
      },
    ],
  },
  {
    sectionTitle: 'For Students',
    items: [
      {
        question: 'How do I apply?',
        answer: 'Contact the provider directly.',
      },
    ],
  },
];

describe('EndorsedProvidersFAQs', () => {
  it('returns null when sections array is empty', () => {
    const { container } = render(<EndorsedProvidersFAQs sections={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders FAQ heading', () => {
    render(<EndorsedProvidersFAQs sections={faqSections} />);
    expect(screen.getByText('Frequently asked questions')).toBeInTheDocument();
  });

  it('renders section titles and FAQ items', () => {
    render(<EndorsedProvidersFAQs sections={faqSections} />);

    expect(screen.getByText('About the Endorsement')).toBeInTheDocument();
    expect(screen.getByText('For Students')).toBeInTheDocument();
    expect(screen.getByText('What does endorsement mean?')).toBeInTheDocument();
    expect(screen.getByText('It means the provider meets NDA standards.')).toBeInTheDocument();
    expect(screen.getByText('How do I apply?')).toBeInTheDocument();
    expect(screen.getByText('Contact the provider directly.')).toBeInTheDocument();
  });
});
