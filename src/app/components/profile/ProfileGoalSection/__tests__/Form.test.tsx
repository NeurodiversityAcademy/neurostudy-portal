import React, { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileSectionRef } from '@/app/interfaces/Profile';

jest.mock('next/image', () => require('@/testUtils/mockNextImage'));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockProfileContext = {
  data: {
    Goals: ['Get a Job'],
    Interests: ['Carpentry'],
    Contents: ['Video'],
  },
  isLoading: false,
  isEditing: true,
  saveData: jest.fn(),
  courses: [],
};

jest.mock('@/app/utilities/profile/ProfileProvider', () => ({
  useProfileContext: () => mockProfileContext,
}));

import ProfileGoalForm from '../Form';

describe('ProfileGoalForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProfileContext.data = {
      Goals: ['Get a Job'],
      Interests: ['Carpentry'],
      Contents: ['Video'],
    };
  });

  it('renders goal form field labels', () => {
    render(<ProfileGoalForm />);
    expect(screen.getByText('Choose any 3 Learning Goals from below')).toBeInTheDocument();
    expect(screen.getByText('Choose or Add any 5 topics that interest you')).toBeInTheDocument();
    expect(
      screen.getByText('What kind of content would you find most engaging?'),
    ).toBeInTheDocument();
  });

  it('renders helper text for contents field', () => {
    render(<ProfileGoalForm />);
    expect(
      screen.getByText('This will help us create personalised experience for you'),
    ).toBeInTheDocument();
  });

  it('does not render footer when onSubmit is not provided', () => {
    render(<ProfileGoalForm />);
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  it('renders footer when onSubmit is provided', () => {
    render(<ProfileGoalForm onSubmit={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('calls onCancel when Cancel is clicked in popup mode', () => {
    const onCancel = jest.fn();
    render(<ProfileGoalForm onSubmit={jest.fn()} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('exposes react-hook-form methods via ref', () => {
    const ref = createRef<ProfileSectionRef>();
    render(<ProfileGoalForm ref={ref} />);
    expect(ref.current?.methods).toBeDefined();
    expect(ref.current?.methods.getValues).toBeDefined();
  });

  it('handles missing profile data', () => {
    mockProfileContext.data = undefined;
    render(<ProfileGoalForm />);
    expect(screen.getByText('Choose any 3 Learning Goals from below')).toBeInTheDocument();
  });

  it('wires Save button as form submit in popup mode', () => {
    render(<ProfileGoalForm onSubmit={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByText('Save').closest('button')).toHaveAttribute('type', 'submit');
  });
});
