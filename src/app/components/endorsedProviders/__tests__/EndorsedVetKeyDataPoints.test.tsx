import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { fill, quality, ...rest } = props;
    return <img {...rest} />;
  },
}));

import EndorsedVetKeyDataPoints from '../EndorsedVetKeyDataPoints';
import type { VetKeyDataPoint } from '../endorsedProviderPageData';

const mockIcon = {
  src: '/vet-stat.png',
  width: 100,
  height: 100,
} as unknown as import('next/image').StaticImageData;

const dataPoints: VetKeyDataPoint[] = [
  {
    id: 'vet-disability-prevalence',
    icon: mockIcon,
    headline: '4-5%',
    title: 'of VET students report having a disability',
    description: 'representing over 180,000 enrolments nationally.',
  },
  {
    id: 'vet-disability-young',
    icon: mockIcon,
    headline: '5.4%',
    title: 'Report disability',
    description: 'Among VET students aged 15–24',
  },
];

describe('EndorsedVetKeyDataPoints', () => {
  it('returns null when dataPoints is empty', () => {
    const { container } = render(<EndorsedVetKeyDataPoints dataPoints={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders section title and intro', () => {
    render(<EndorsedVetKeyDataPoints dataPoints={dataPoints} />);

    expect(screen.getByText('6 Key Data Points –')).toBeInTheDocument();
    expect(screen.getByText('Neurodiversity & Disability in VET')).toBeInTheDocument();
    expect(screen.getByText(/Insights into vocational education/)).toBeInTheDocument();
  });

  it('renders each data point card', () => {
    render(<EndorsedVetKeyDataPoints dataPoints={dataPoints} />);

    expect(screen.getByText('4-5%')).toBeInTheDocument();
    expect(screen.getByText('of VET students report having a disability')).toBeInTheDocument();
    expect(
      screen.getByText('representing over 180,000 enrolments nationally.'),
    ).toBeInTheDocument();
    expect(screen.getByText('5.4%')).toBeInTheDocument();
    expect(screen.getByText('Report disability')).toBeInTheDocument();
  });
});
