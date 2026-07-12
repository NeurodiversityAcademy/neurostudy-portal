import { render } from '@testing-library/react';
import EndorsedCertifiedBadge from '../EndorsedCertifiedBadge';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: { alt: string }) => <img alt={props.alt} />,
}));

describe('EndorsedCertifiedBadge', () => {
  it('renders gold star when certified', () => {
    const { container } = render(
      <EndorsedCertifiedBadge size='card' certified />
    );

    expect(
      container.querySelector('svg[aria-hidden="true"]')
    ).toBeInTheDocument();
  });

  it('omits gold star when not certified', () => {
    const { container } = render(
      <EndorsedCertifiedBadge size='meta' certified={false} />
    );

    expect(container.querySelector('svg[aria-hidden="true"]')).toBeNull();
  });
});
