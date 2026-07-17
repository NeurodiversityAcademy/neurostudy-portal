import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { fill, ...rest } = props;
    return <img {...rest} />;
  },
}));

import EndorsedProviderEnhancements from '../EndorsedProviderEnhancements';
import type { SupportFrameworkSection } from '../endorsedProviderPageData';

const mockIcon = {
  src: '/icon.png',
  width: 72,
  height: 72,
} as unknown as import('next/image').StaticImageData;

const supportFramework: SupportFrameworkSection[] = [
  {
    section: 'Staff Training',
    items: [
      { label: 'NDA-approved training', status: 'Supports in place' },
      { label: 'Peer mentoring', status: 'In the works' },
    ],
  },
  {
    section: 'Assessment',
    items: [{ label: 'Flexible deadlines', status: 'Supports in place' }],
  },
];

describe('EndorsedProviderEnhancements', () => {
  it('returns null when all sections are empty', () => {
    const { container } = render(
      <EndorsedProviderEnhancements supportFramework={[]} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('returns null when items have no supported statuses', () => {
    const { container } = render(
      <EndorsedProviderEnhancements
        supportFramework={[
          {
            section: 'Empty',
            items: [],
          },
        ]}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders heading and framework rows', () => {
    render(
      <EndorsedProviderEnhancements supportFramework={supportFramework} />,
    );

    expect(screen.getByText('Endorsed Provider Insights')).toBeInTheDocument();
    expect(screen.getByText('Staff Training')).toBeInTheDocument();
    expect(screen.getByText('Assessment')).toBeInTheDocument();
    expect(screen.getByText('NDA-approved training')).toBeInTheDocument();
    expect(screen.getByText('Peer mentoring')).toBeInTheDocument();
    expect(screen.getByText('Flexible deadlines')).toBeInTheDocument();
  });

  it('renders column headers when both status types exist', () => {
    render(
      <EndorsedProviderEnhancements supportFramework={supportFramework} />,
    );

    expect(screen.getByText('Area')).toBeInTheDocument();
    expect(screen.getAllByText('Supports in place').length).toBeGreaterThan(0);
    expect(screen.getAllByText('In the works').length).toBeGreaterThan(0);
  });

  it('shows NDA Certified mark when ndaCertified is true', () => {
    render(
      <EndorsedProviderEnhancements
        supportFramework={supportFramework}
        ndaCertified
      />,
    );

    expect(screen.getByText('★ NDA Certified')).toBeInTheDocument();
  });

  it('does not show NDA Certified mark when ndaCertified is false', () => {
    render(
      <EndorsedProviderEnhancements supportFramework={supportFramework} />,
    );

    expect(screen.queryByText('★ NDA Certified')).not.toBeInTheDocument();
  });

  it('renders only supports column when no in-the-works items exist', () => {
    render(
      <EndorsedProviderEnhancements
        supportFramework={[
          {
            section: 'Assessment',
            items: [{ label: 'Flexible deadlines', status: 'Supports in place' }],
          },
        ]}
      />,
    );

    expect(screen.getAllByText('Supports in place').length).toBeGreaterThan(0);
    expect(screen.queryByText('In the works')).not.toBeInTheDocument();
  });
});
