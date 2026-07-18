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
    Strategies: ['Focused Learning'],
    ManagingWays: ['Breaks'],
    FocusAids: true,
    MeetNDLearners: false,
    EffectiveStrategy: 'Morning study routine',
  },
  isLoading: false,
  isEditing: true,
  saveData: jest.fn(),
  courses: [],
};

jest.mock('@/app/utilities/profile/ProfileProvider', () => ({
  useProfileContext: () => mockProfileContext,
}));

import ProfileStrategyForm from '../Form';

describe('ProfileStrategyForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProfileContext.data = {
      Strategies: ['Focused Learning'],
      ManagingWays: ['Breaks'],
      FocusAids: true,
      MeetNDLearners: false,
      EffectiveStrategy: 'Morning study routine',
    };
  });

  it('renders strategy form field labels', () => {
    render(<ProfileStrategyForm />);
    expect(
      screen.getByText('What strategies do you use to manage your time effectively?'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('How do you manage sensory overload in learning environments?'),
    ).toBeInTheDocument();
    expect(screen.getByText(/Would access to fidget toys/)).toBeInTheDocument();
    expect(
      screen.getByText('Would you be interested in meeting/collaborating with other ND learners?*'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'What is one learning strategy that has been particularly helpful for you?*',
      ),
    ).toBeInTheDocument();
  });

  it('does not render footer when onSubmit is not provided', () => {
    render(<ProfileStrategyForm />);
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  it('renders footer when onSubmit is provided', () => {
    render(<ProfileStrategyForm onSubmit={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('calls onCancel when Cancel is clicked in popup mode', () => {
    const onCancel = jest.fn();
    render(<ProfileStrategyForm onSubmit={jest.fn()} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('exposes react-hook-form methods via ref', () => {
    const ref = createRef<ProfileSectionRef>();
    render(<ProfileStrategyForm ref={ref} />);
    expect(ref.current?.methods).toBeDefined();
    expect(ref.current?.methods.getValues).toBeDefined();
  });

  it('handles missing profile data', () => {
    mockProfileContext.data = undefined;
    render(<ProfileStrategyForm />);
    expect(
      screen.getByText('What strategies do you use to manage your time effectively?'),
    ).toBeInTheDocument();
  });

  it('wires Save button as form submit in popup mode', () => {
    render(<ProfileStrategyForm onSubmit={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByText('Save').closest('button')).toHaveAttribute('type', 'submit');
  });
});
