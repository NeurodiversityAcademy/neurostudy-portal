import { render } from '@testing-library/react';
import EndorsedCertifiedBadge from '../EndorsedCertifiedBadge';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: { alt: string }) => <img alt={props.alt} />,
}));

describe('EndorsedCertifiedBadge', () => {
  it('renders gold star when certified', () => {
    const { getByText } = render(<EndorsedCertifiedBadge size='card' certified />);

    expect(getByText('★')).toBeInTheDocument();
  });

  it('omits gold star when not certified', () => {
    const { queryByText } = render(<EndorsedCertifiedBadge size='meta' certified={false} />);

    expect(queryByText('★')).not.toBeInTheDocument();
  });
});
