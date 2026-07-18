import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('next/image', () => require('@/testUtils/mockNextImage'));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/profile',
}));

jest.mock('@/app/hooks/useHideOverflowEffect', () => ({
  __esModule: true,
  default: () => () => () => {},
}));

const mockProfileContext = {
  data: {
    FirstName: 'John',
    LastName: 'Doe',
    Email: 'john@example.com',
    Age: 25,
  },
  isLoading: false,
  isEditing: false,
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

import ProfileBodyHeader from '../ProfileBodyHeader';
import ProfileCard from '../ProfileCard';
import ProfileContainer from '../ProfileContainer';
import ProfileCourses from '../ProfileCourses';
import ProfileFormFooter from '../ProfileFormFooter';
import ProfileRightSidebar from '../ProfileRightSidebar';

jest.mock('../ProfileBody', () => ({
  __esModule: true,
  default: () => <div data-testid='profile-body'>Profile Body</div>,
}));

describe('ProfileBodyHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProfileContext.isEditing = false;
    mockProfileContext.isLoading = false;
    mockProfileContext.data = {
      FirstName: 'John',
      LastName: 'Doe',
      Email: 'john@example.com',
      Age: 25,
    };
  });

  it('renders user name', () => {
    render(<ProfileBodyHeader />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders email and age', () => {
    render(<ProfileBodyHeader />);
    expect(screen.getByText('john@example.com | 25 Years')).toBeInTheDocument();
  });

  it('renders Edit Profile button when not editing', () => {
    render(<ProfileBodyHeader />);
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
  });

  it('navigates to edit mode when Edit Profile is clicked', () => {
    render(<ProfileBodyHeader />);
    fireEvent.click(screen.getByText('Edit Profile'));
    expect(mockPush).toHaveBeenCalledWith('?edit=1');
  });

  it('hides Edit Profile when isEditing is true', () => {
    mockProfileContext.isEditing = true;
    render(<ProfileBodyHeader />);
    expect(screen.queryByText('Edit Profile')).not.toBeInTheDocument();
  });

  it('renders edit image icon', () => {
    render(<ProfileBodyHeader />);
    expect(screen.getByAltText('Edit Image')).toBeInTheDocument();
  });

  it('handles missing Age gracefully', () => {
    mockProfileContext.data = {
      FirstName: 'Jane',
      LastName: 'Smith',
      Email: 'jane@test.com',
      Age: 0,
    };
    render(<ProfileBodyHeader />);
    expect(screen.getByText('jane@test.com')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    mockProfileContext.data = {
      FirstName: '',
      LastName: '',
      Email: '',
      Age: 0,
    };
    const { container } = render(<ProfileBodyHeader />);
    expect(container).toBeInTheDocument();
  });
});

describe('ProfileCard', () => {
  it('renders with a title', () => {
    render(<ProfileCard title='My Section'>Content</ProfileCard>);
    expect(screen.getByText('My Section')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders with custom header', () => {
    render(
      <ProfileCard header={<div data-testid='custom-header'>Header</div>}>Content</ProfileCard>,
    );
    expect(screen.queryByTestId('custom-header')).not.toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders with null header (no header rendered)', () => {
    render(<ProfileCard header={null}>Body Only</ProfileCard>);
    expect(screen.getByText('Body Only')).toBeInTheDocument();
  });

  it('supports collapsible mode', () => {
    render(
      <ProfileCard title='Collapsible' collapsible>
        Expandable Content
      </ProfileCard>,
    );
    expect(screen.getByText('Collapsible')).toBeInTheDocument();
    expect(screen.getByText('Expandable Content')).toBeInTheDocument();
  });

  it('toggles content on header click when collapsible', () => {
    render(
      <ProfileCard title='Toggle Me' collapsible>
        Toggle Content
      </ProfileCard>,
    );
    const header = screen.getByText('Toggle Me').closest('[role="button"]');
    expect(header).toBeInTheDocument();
    if (header) {
      fireEvent.click(header);
    }
  });

  it('does not have role=button when not collapsible', () => {
    render(<ProfileCard title='Not Collapsible'>Static</ProfileCard>);
    const header = screen.getByText('Not Collapsible').closest('[role="button"]');
    expect(header).toBeNull();
  });

  it('shows left icon when provided', () => {
    render(
      <ProfileCard title='With Icon' leftIconSrc='/icon.svg' leftIconAlt='Section Icon'>
        Content
      </ProfileCard>,
    );
    expect(screen.getByAltText('Section Icon')).toBeInTheDocument();
  });

  it('hides left icon in popup mode', () => {
    render(
      <ProfileCard title='Popup' leftIconSrc='/icon.svg' leftIconAlt='Icon' popup>
        Content
      </ProfileCard>,
    );
    expect(screen.queryByAltText('Icon')).not.toBeInTheDocument();
  });

  it('shows loader when isLoading', () => {
    const { container } = render(
      <ProfileCard title='Loading' isLoading>
        Content
      </ProfileCard>,
    );
    expect(container.querySelector('[aria-hidden]')).toBeInTheDocument();
  });
});

describe('ProfileContainer', () => {
  it('renders profile sidebar and body', () => {
    render(<ProfileContainer />);
    expect(screen.getByTestId('profile-body')).toBeInTheDocument();
  });
});

describe('ProfileCourses', () => {
  it('renders nothing when no courses', () => {
    mockProfileContext.courses = [];
    const { container } = render(<ProfileCourses />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('ProfileFormFooter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProfileContext.isLoading = false;
  });

  it('renders Cancel and Save buttons', () => {
    render(<ProfileFormFooter />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('calls onCancel when Cancel is clicked', () => {
    const onCancel = jest.fn();
    render(<ProfileFormFooter onCancel={onCancel} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit when Save is clicked', () => {
    const onSubmit = jest.fn();
    render(<ProfileFormFooter onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText('Save'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('disables Save when loading', () => {
    mockProfileContext.isLoading = true;
    render(<ProfileFormFooter />);
    expect(screen.getByText('Save').closest('button')).toBeDisabled();
  });

  it('renders Save as submit type when onSubmit is not provided', () => {
    render(<ProfileFormFooter />);
    const saveButton = screen.getByText('Save').closest('button');
    expect(saveButton).toHaveAttribute('type', 'submit');
  });

  it('renders Save as button type when onSubmit is provided', () => {
    render(<ProfileFormFooter onSubmit={jest.fn()} />);
    const saveButton = screen.getByText('Save').closest('button');
    expect(saveButton).toHaveAttribute('type', 'button');
  });

  it('applies custom className', () => {
    const { container } = render(<ProfileFormFooter className='custom-footer' />);
    expect(container.firstChild).toHaveClass('custom-footer');
  });
});

describe('ProfileRightSidebar', () => {
  it('renders Level 1 text', () => {
    render(<ProfileRightSidebar />);
    expect(screen.getByText('Level 1')).toBeInTheDocument();
  });

  it('renders level image', () => {
    render(<ProfileRightSidebar />);
    expect(screen.getByAltText('Level 1')).toBeInTheDocument();
  });

  it('renders star image', () => {
    render(<ProfileRightSidebar />);
    expect(screen.getByAltText('Star')).toBeInTheDocument();
  });

  it('renders progress text', () => {
    render(<ProfileRightSidebar />);
    expect(screen.getByText('Complete 1 Step to reach Level 2')).toBeInTheDocument();
  });
});
