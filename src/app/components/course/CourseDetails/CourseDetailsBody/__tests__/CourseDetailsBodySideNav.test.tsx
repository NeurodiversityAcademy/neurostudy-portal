import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('../../../ApplyNowPopup/ApplyNowPopup', () => ({
  __esModule: true,
  default: ({ open, onClose }: { open: boolean; onClose: () => void }) =>
    open ? (
      <div data-testid='apply-now-popup'>
        <button type='button' onClick={onClose}>
          Close Apply Now
        </button>
      </div>
    ) : null,
}));

import CourseDetailsBodySideNav from '../CourseDetailsBodySideNav';

const sections = [
  { id: 'courseOverview', title: 'Course Overview' },
  { id: 'courseStructure', title: 'Course Structure' },
  { id: 'faq', title: 'FAQs' },
];

describe('CourseDetailsBodySideNav', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a navigation element with section links', () => {
    render(<CourseDetailsBodySideNav sections={sections} />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Course Overview' })).toHaveAttribute(
      'href',
      '#courseOverview',
    );
    expect(screen.getByRole('link', { name: 'Course Structure' })).toHaveAttribute(
      'href',
      '#courseStructure',
    );
    expect(screen.getByRole('link', { name: 'FAQs' })).toHaveAttribute('href', '#faq');
  });

  it('renders Apply Now button in the actions area', () => {
    render(<CourseDetailsBodySideNav sections={sections} />);

    expect(screen.getByRole('button', { name: /apply now/i })).toBeInTheDocument();
  });

  it('opens Apply Now popup when Apply Now is clicked', async () => {
    const user = userEvent.setup();
    render(<CourseDetailsBodySideNav sections={sections} />);

    expect(screen.queryByTestId('apply-now-popup')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /apply now/i }));

    expect(screen.getByTestId('apply-now-popup')).toBeInTheDocument();
  });

  it('closes Apply Now popup when onClose is invoked', async () => {
    const user = userEvent.setup();
    render(<CourseDetailsBodySideNav sections={sections} />);

    await user.click(screen.getByRole('button', { name: /apply now/i }));
    await user.click(screen.getByRole('button', { name: /close apply now/i }));

    expect(screen.queryByTestId('apply-now-popup')).not.toBeInTheDocument();
  });

  it('renders one list item per section plus actions item', () => {
    render(<CourseDetailsBodySideNav sections={sections} />);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(sections.length + 1);
  });
});
