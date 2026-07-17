import React, { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileSectionRef } from '@/app/interfaces/Profile';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const mockProfileContext = {
  data: {
    Conditions: ['ADHD'],
    Institutions: ['Test University'],
    LearningStyle: ['Visual'],
    Adjustments: ['Better Classroom'],
    UsedTools: ['Fidget'],
    EnvDescription: 'Quiet remote setup',
  },
  isLoading: false,
  isEditing: true,
  saveData: jest.fn(),
  courses: [],
};

jest.mock('@/app/utilities/profile/ProfileProvider', () => ({
  useProfileContext: () => mockProfileContext,
}));

import ProfilePreferenceForm from '../Form';

describe('ProfilePreferenceForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProfileContext.data = {
      Conditions: ['ADHD'],
      Institutions: ['Test University'],
      LearningStyle: ['Visual'],
      Adjustments: ['Better Classroom'],
      UsedTools: ['Fidget'],
      EnvDescription: 'Quiet remote setup',
    };
  });

  it('renders preference form field labels', () => {
    render(<ProfilePreferenceForm />);
    expect(
      screen.getByText('Tell us about your Neuro-Condition'),
    ).toBeInTheDocument();
    expect(screen.getByText('Learning Institutions')).toBeInTheDocument();
    expect(
      screen.getByText('Select your preferred learning style'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('If you need any adjustments, add them here'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Tell us about any accessibility tools you’ve used in the past',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Describe a learning environment that you find ideal*'),
    ).toBeInTheDocument();
  });

  it('does not render footer when onSubmit is not provided', () => {
    render(<ProfilePreferenceForm />);
    expect(screen.queryByText('Cancel')).toBeNull();
    expect(screen.queryByText('Save')).toBeNull();
  });

  it('renders footer when onSubmit is provided', () => {
    render(
      <ProfilePreferenceForm onSubmit={jest.fn()} onCancel={jest.fn()} />,
    );
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('calls onCancel when Cancel is clicked in popup mode', () => {
    const onCancel = jest.fn();
    render(
      <ProfilePreferenceForm onSubmit={jest.fn()} onCancel={onCancel} />,
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('exposes react-hook-form methods via ref', () => {
    const ref = createRef<ProfileSectionRef>();
    render(<ProfilePreferenceForm ref={ref} />);
    expect(ref.current?.methods).toBeDefined();
    expect(ref.current?.methods.trigger).toBeDefined();
  });

  it('handles missing profile data', () => {
    mockProfileContext.data = undefined;
    render(<ProfilePreferenceForm />);
    expect(
      screen.getByText('Tell us about your Neuro-Condition'),
    ).toBeInTheDocument();
  });

  it('wires Save button as form submit in popup mode', () => {
    render(
      <ProfilePreferenceForm onSubmit={jest.fn()} onCancel={jest.fn()} />,
    );
    expect(screen.getByText('Save').closest('button')).toHaveAttribute(
      'type',
      'submit',
    );
  });
});
