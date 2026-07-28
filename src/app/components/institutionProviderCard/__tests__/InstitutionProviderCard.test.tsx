import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

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

const trackInstitutionCtaClick = jest.fn();

jest.mock('../../emergingInstitutions/EmergingInstitutionCtaButton', () => {
  const actual = jest.requireActual('../../emergingInstitutions/EmergingInstitutionCtaButton');
  return {
    __esModule: true,
    ...actual,
    trackInstitutionCtaClick: (...args: unknown[]) => trackInstitutionCtaClick(...args),
    default: ({ label = 'Explore More', decorative }: { label?: string; decorative?: boolean }) =>
      decorative ? <span aria-hidden='true'>{label}</span> : <a href='#'>{label}</a>,
  };
});

import InstitutionProviderCard, {
  INSTITUTION_PROVIDER_HEADER_KIND,
} from '../InstitutionProviderCard';

describe('InstitutionProviderCard', () => {
  beforeEach(() => {
    trackInstitutionCtaClick.mockClear();
  });

  it('renders yellow header without top media and without footer action', () => {
    const { container } = render(
      <InstitutionProviderCard
        header={{ kind: INSTITUTION_PROVIDER_HEADER_KIND.YELLOW }}
        center={<span>Center content</span>}
      />,
    );

    expect(screen.getByText('Center content')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByText('Explore More')).not.toBeInTheDocument();
    expect(screen.queryByText('Coming soon')).not.toBeInTheDocument();
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('renders cherryPieSub header without top media', () => {
    render(
      <InstitutionProviderCard
        header={{ kind: INSTITUTION_PROVIDER_HEADER_KIND.CHERRY_PIE_SUB }}
        center={<span>Logo</span>}
        comingSoonLabel='Coming soon'
      />,
    );

    expect(screen.getByText('Logo')).toBeInTheDocument();
    expect(screen.getByText('Coming soon')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders remote header image when configured', () => {
    render(
      <InstitutionProviderCard
        header={{
          kind: INSTITUTION_PROVIDER_HEADER_KIND.REMOTE_IMAGE,
          src: '/images/remote-header.webp',
        }}
        center={<span>Remote</span>}
        ctaHref='/endorsedproviders/example'
      />,
    );

    expect(screen.getByText('Remote')).toBeInTheDocument();
    expect(document.querySelector('img')).toHaveAttribute('src', '/images/remote-header.webp');
    expect(screen.getByRole('link', { name: 'Explore More' })).toHaveAttribute(
      'href',
      '/endorsedproviders/example',
    );
  });

  it('fires CTA analytics when the stretch link is clicked', () => {
    render(
      <InstitutionProviderCard
        ctaHref='/emergingproviders/bond-university'
        header={{ kind: INSTITUTION_PROVIDER_HEADER_KIND.EMERGING_DEFAULT }}
        center={<span>Bond</span>}
        gaEvent={{
          eventName: 'emerging_cta_click',
          category: 'Emerging',
          fileName: 'bond-university',
        }}
      />,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Explore More' }));
    expect(trackInstitutionCtaClick).toHaveBeenCalledWith(
      expect.objectContaining({
        ctaHref: '/emergingproviders/bond-university',
        label: 'Explore More',
      }),
    );
  });
});
