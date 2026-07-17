import React from 'react';
import { render, screen } from '@testing-library/react';

import EndorsedStudyAreas from '../EndorsedStudyAreas';

describe('EndorsedStudyAreas', () => {
  it('returns null when studyAreas is empty', () => {
    const { container } = render(<EndorsedStudyAreas studyAreas={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders heading and study area pills', () => {
    render(
      <EndorsedStudyAreas
        studyAreas={['Creative Arts', 'Health Sciences', 'Business']}
      />,
    );

    expect(screen.getByText('Study Areas')).toBeInTheDocument();
    expect(screen.getByText('Creative Arts')).toBeInTheDocument();
    expect(screen.getByText('Health Sciences')).toBeInTheDocument();
    expect(screen.getByText('Business')).toBeInTheDocument();
  });
});
