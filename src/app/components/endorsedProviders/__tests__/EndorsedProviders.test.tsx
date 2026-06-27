import { render } from '@testing-library/react';
import EndorsedProviders from '../EndorsedProviders';
import { buildEndorsedDemoDetailHref } from '@/app/utilities/demoAccess';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: { alt: string }) => <img alt={props.alt} />,
}));

describe('EndorsedProviders demo access', () => {
  it('renders nothing without demoGuid and demoSlug props', () => {
    const { container } = render(<EndorsedProviders demoGuid='' demoSlug='' />);
    expect(container.firstChild).toBeNull();
  });

  it('renders exactly one card for valid demo slug', () => {
    const { getAllByRole, getByText } = render(
      <EndorsedProviders demoGuid='test-guid' demoSlug='collarts' />
    );

    expect(getByText('NDA Endorsed Providers')).toBeInTheDocument();
    expect(getAllByRole('link')).toHaveLength(1);
  });

  it('uses guid-based detail href with demo query param on card CTA', () => {
    const expectedHref = buildEndorsedDemoDetailHref('test-guid');
    const { getByRole } = render(
      <EndorsedProviders demoGuid='test-guid' demoSlug='collarts' />
    );

    const ctaLink = getByRole('link', { name: 'Explore More' });
    expect(ctaLink.getAttribute('href')).toBe(expectedHref);
  });

  it('renders nothing when demoSlug matches no provider row', () => {
    const { container } = render(
      <EndorsedProviders demoGuid='test-guid' demoSlug='nonexistent-slug' />
    );
    expect(container.firstChild).toBeNull();
  });
});
