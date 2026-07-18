import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/image', () => require('@/testUtils/mockNextImage'));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/profile',
}));

const mockProfileContext = {
  data: {
    FirstName: 'John',
    LastName: 'Doe',
    Email: 'john@example.com',
    Age: 25,
  },
  isLoading: false,
  isEditing: true,
  saveData: jest.fn(),
  courses: [],
};

jest.mock('@/app/utilities/profile/ProfileProvider', () => ({
  useProfileContext: () => mockProfileContext,
}));

jest.mock('@/app/utilities/common', () => ({
  notifyInProgress: jest.fn(),
  notifyError: jest.fn(),
  notifySuccess: jest.fn(),
}));

import ProfilePreferenceSection from '../ProfilePreferenceSection';
import ProfileGoalSection from '../ProfileGoalSection';
import ProfileChallengeSection from '../ProfileChallengeSection';
import ProfileStrategySection from '../ProfileStrategySection';
import ProfileInfoSection from '../ProfileInfoSection';

describe('ProfilePreferenceSection', () => {
  it('renders the section title in edit mode', () => {
    render(<ProfilePreferenceSection />);
    expect(screen.getByText('Neuro Condition & Learning Preferences')).toBeInTheDocument();
  });

  it('renders the section icon in edit mode', () => {
    render(<ProfilePreferenceSection />);
    expect(screen.getByAltText('Neuro Condition & Learning Preferences')).toBeInTheDocument();
  });

  it('renders form when popup is true', () => {
    render(<ProfilePreferenceSection popup onSubmit={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByText('Neuro Condition & Learning Preferences')).toBeInTheDocument();
  });

  it('renders Cancel button in popup mode', () => {
    render(<ProfilePreferenceSection popup onSubmit={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });
});

describe('ProfileGoalSection', () => {
  it('renders the section title in edit mode', () => {
    render(<ProfileGoalSection />);
    expect(screen.getByText('Goals & Interests')).toBeInTheDocument();
  });

  it('renders the section icon in edit mode', () => {
    render(<ProfileGoalSection />);
    expect(screen.getByAltText('Goals & Interests')).toBeInTheDocument();
  });

  it('renders form when popup is true', () => {
    render(<ProfileGoalSection popup onSubmit={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByText('Goals & Interests')).toBeInTheDocument();
  });
});

describe('ProfileChallengeSection', () => {
  it('renders the section title in edit mode', () => {
    render(<ProfileChallengeSection />);
    expect(screen.getByText('Comfort & Challenges')).toBeInTheDocument();
  });

  it('renders the section icon in edit mode', () => {
    render(<ProfileChallengeSection />);
    expect(screen.getByAltText('Comfort & Challenges')).toBeInTheDocument();
  });

  it('renders form when popup is true', () => {
    render(<ProfileChallengeSection popup onSubmit={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByText('Comfort & Challenges')).toBeInTheDocument();
  });
});

describe('ProfileStrategySection', () => {
  it('renders the section title in edit mode', () => {
    render(<ProfileStrategySection />);
    expect(screen.getByText('Strategies & Support')).toBeInTheDocument();
  });

  it('renders the section icon in edit mode', () => {
    render(<ProfileStrategySection />);
    expect(screen.getByAltText('Strategies & Support')).toBeInTheDocument();
  });

  it('renders form when popup is true', () => {
    render(<ProfileStrategySection popup onSubmit={jest.fn()} onCancel={jest.fn()} />);
    expect(screen.getByText('Strategies & Support')).toBeInTheDocument();
  });
});

describe('ProfileInfoSection', () => {
  it('renders Personal Information title', () => {
    render(<ProfileInfoSection />);
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
  });

  it('renders form input placeholders', () => {
    render(<ProfileInfoSection />);
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
  });
});
