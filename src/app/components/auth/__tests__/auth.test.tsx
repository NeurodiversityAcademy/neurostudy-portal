import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/test',
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { priority, fill, ...rest } = props;
    return <img {...rest} />;
  },
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

const mockSignIn = jest.fn();
jest.mock('next-auth/react', () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
  signOut: jest.fn(),
  useSession: () => ({ data: null, status: 'unauthenticated' }),
}));

jest.mock('@/app/utilities/auth/signUp', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/app/utilities/auth/resetPassword', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/app/utilities/auth/confirmResetPassword', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/app/utilities/auth/resendSignUpCode', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/app/utilities/common', () => ({
  notifyError: jest.fn(),
  notifyAxiosError: jest.fn(),
  notifyInProgress: jest.fn(),
  notifySuccess: jest.fn(),
  formatDate: jest.fn(
    (y: number, m: number, d: number) => `${y}-${m}-${d}`
  ),
  debounce: jest.fn((fn: (...args: unknown[]) => void) => fn),
}));

jest.mock('@/app/utilities/queryString', () => ({
  __esModule: true,
  default: { parse: jest.fn(() => ({})), stringify: jest.fn(() => '') },
}));

jest.mock('@/app/hooks/useAuthError', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/app/utilities/auth/helper', () => ({
  getCallbackUrlOnSignIn: jest.fn(() => '/profile'),
}));

import Login from '../Login';
import AuthInitSignUp from '../AuthInitSignUp';
import AuthVerifyForm from '../AuthVerifyForm';
import AuthResendOTPBtn from '../AuthResendOTPBtn';
import AuthInitForgotPassword from '../AuthInitForgotPassword';
import AuthFinishForgotPassword from '../AuthFinishForgotPassword';
import AuthFormHeader from '../AuthFormHeader';
import AuthFormFooter from '../AuthFormFooter';
import AuthLeftBanner from '../AuthLeftBanner';
import ForgotPassword from '../ForgotPassword';
import Signup from '../Signup';
import signUp from '@/app/utilities/auth/signUp';
import resetPassword from '@/app/utilities/auth/resetPassword';
import confirmResetPassword from '@/app/utilities/auth/confirmResetPassword';
import resendSignUpCode from '@/app/utilities/auth/resendSignUpCode';
import {
  notifyError,
  notifyAxiosError,
  notifyInProgress,
} from '@/app/utilities/common';
import {
  FORM_STATE,
  INVALID_CREDENTIALS_MESSAGE,
} from '@/app/utilities/auth/constants';
import { TOAST_UNKNOWN_ERROR_MESSAGE } from '@/app/utilities/constants';

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// AuthFormHeader
// ---------------------------------------------------------------------------
describe('AuthFormHeader', () => {
  it('renders default title and subText', () => {
    render(<AuthFormHeader />);
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText('Its quick and easy')).toBeInTheDocument();
  });

  it('renders custom title and subText', () => {
    render(<AuthFormHeader title='Login' subText='to your account' />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('to your account')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// AuthFormFooter
// ---------------------------------------------------------------------------
describe('AuthFormFooter', () => {
  it('renders text and link', () => {
    render(
      <AuthFormFooter
        text='New here? '
        toText='Sign Up'
        to='/signup'
      />
    );
    expect(screen.getByText('New here?')).toBeInTheDocument();
    const link = screen.getByText('Sign Up');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/signup');
  });

  it('renders Google and Facebook buttons', () => {
    render(<AuthFormFooter />);
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('Facebook')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// AuthLeftBanner
// ---------------------------------------------------------------------------
describe('AuthLeftBanner', () => {
  it('renders the banner heading', () => {
    render(<AuthLeftBanner />);
    expect(
      screen.getByText('Signup/Login to Neurodiversity Academy')
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
describe('Login', () => {
  it('renders email and password fields plus submit button', () => {
    render(<Login />);
    expect(
      screen.getByPlaceholderText('Email address')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Password')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /login/i })
    ).toBeInTheDocument();
  });

  it('renders header with Login title', () => {
    render(<Login />);
    const headings = screen.getAllByText('Login');
    expect(headings.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('to your account')).toBeInTheDocument();
  });

  it('renders forgot password link', () => {
    render(<Login />);
    const link = screen.getByText('Forgot Password?');
    expect(link.closest('a')).toHaveAttribute('href', '/forgotpassword');
  });

  it('renders sign-up call-to-action', () => {
    render(<Login />);
    const link = screen.getByText('Sign Up');
    expect(link.closest('a')).toHaveAttribute('href', '/signup');
  });

  it('calls signIn on valid form submit and redirects on success', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce({ ok: true });

    render(<Login />);

    await user.type(
      screen.getByPlaceholderText('Email address'),
      'user@test.com'
    );
    await user.type(screen.getByPlaceholderText('Password'), 'Pass1234');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        'credentials',
        expect.objectContaining({
          username: 'user@test.com',
          password: 'Pass1234',
          redirect: false,
        }),
        { method: 'signIn' }
      );
    });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/profile');
    });
  });

  it('notifies error when signIn throws', async () => {
    const user = userEvent.setup();
    mockSignIn.mockRejectedValueOnce(new Error('network'));

    render(<Login />);

    await user.type(
      screen.getByPlaceholderText('Email address'),
      'user@test.com'
    );
    await user.type(screen.getByPlaceholderText('Password'), 'Pass1234');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(notifyError).toHaveBeenCalled();
    });
  });

  it('shows verify form when signIn returns CONFIRM_SIGN_UP', async () => {
    const user = userEvent.setup();
    const signInOutput = {
      nextStep: { signInStep: FORM_STATE.CONFIRM_SIGN_UP },
    };
    mockSignIn.mockResolvedValueOnce({
      ok: false,
      error: JSON.stringify(signInOutput),
    });

    render(<Login />);

    await user.type(
      screen.getByPlaceholderText('Email address'),
      'user@test.com'
    );
    await user.type(screen.getByPlaceholderText('Password'), 'Pass1234');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Verification Code')
      ).toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// AuthInitSignUp
// ---------------------------------------------------------------------------
describe('AuthInitSignUp', () => {
  it('renders all sign-up form fields', () => {
    render(<AuthInitSignUp />);
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Repeat Password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign up/i })
    ).toBeInTheDocument();
  });

  it('renders terms link and login footer', () => {
    render(<AuthInitSignUp />);
    expect(
      screen.getByText(/Terms and Conditions/i)
    ).toBeInTheDocument();
    const loginLink = screen.getByText('Login');
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
  });

  it('renders Date of Birth dropdowns', () => {
    render(<AuthInitSignUp />);
    expect(screen.getByText('Date of Birth')).toBeInTheDocument();
  });

  it('renders newsletter subscription checkbox', () => {
    render(<AuthInitSignUp />);
    expect(
      screen.getByText(/Subscribe to our newsletter/i)
    ).toBeInTheDocument();
  });

  it('submit button is present and of type submit', () => {
    render(<AuthInitSignUp />);
    const btn = screen.getByRole('button', { name: /sign up/i });
    expect(btn).toHaveAttribute('type', 'submit');
  });

  it('shows verify form after successful signUp with CONFIRM_SIGN_UP', async () => {
    const user = userEvent.setup();
    (signUp as jest.Mock).mockResolvedValueOnce({
      nextStep: { signUpStep: FORM_STATE.CONFIRM_SIGN_UP },
    });

    render(<AuthInitSignUp />);

    await user.type(screen.getByPlaceholderText('First Name'), 'Jane');
    await user.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await user.type(
      screen.getByPlaceholderText('Email address'),
      'jane@example.com'
    );
    await user.type(screen.getByPlaceholderText('Password'), 'Pass1234!');
    await user.type(screen.getByPlaceholderText('Repeat Password'), 'Pass1234!');

    fireEvent.focus(screen.getByPlaceholderText('Date'));
    fireEvent.click(screen.getByText('15'));
    fireEvent.focus(screen.getByPlaceholderText('Month'));
    fireEvent.click(screen.getByText('Jan'));
    fireEvent.focus(screen.getByPlaceholderText('Year'));
    fireEvent.click(screen.getByText(String(new Date().getFullYear() - 10)));

    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(signUp).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'jane@example.com',
          password: 'Pass1234!',
          options: expect.objectContaining({
            userAttributes: expect.objectContaining({
              given_name: 'Jane',
              family_name: 'Doe',
              subscribed: '0',
            }),
          }),
        })
      );
    });

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Verification Code')
      ).toBeInTheDocument();
    });
  });

  it('calls notifyAxiosError when signUp fails', async () => {
    const user = userEvent.setup();
    (signUp as jest.Mock).mockRejectedValueOnce(new Error('signup failed'));

    render(<AuthInitSignUp />);

    await user.type(screen.getByPlaceholderText('First Name'), 'Jane');
    await user.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await user.type(
      screen.getByPlaceholderText('Email address'),
      'jane@example.com'
    );
    await user.type(screen.getByPlaceholderText('Password'), 'Pass1234!');
    await user.type(screen.getByPlaceholderText('Repeat Password'), 'Pass1234!');

    fireEvent.focus(screen.getByPlaceholderText('Date'));
    fireEvent.click(screen.getByText('15'));
    fireEvent.focus(screen.getByPlaceholderText('Month'));
    fireEvent.click(screen.getByText('Jan'));
    fireEvent.focus(screen.getByPlaceholderText('Year'));
    fireEvent.click(screen.getByText(String(new Date().getFullYear() - 10)));

    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(notifyAxiosError).toHaveBeenCalled();
    });
  });

  it('calls notifyInProgress when signUp returns an unexpected step', async () => {
    const user = userEvent.setup();
    (signUp as jest.Mock).mockResolvedValueOnce({
      nextStep: { signUpStep: 'UNKNOWN_STEP' },
    });

    render(<AuthInitSignUp />);

    await user.type(screen.getByPlaceholderText('First Name'), 'Jane');
    await user.type(screen.getByPlaceholderText('Last Name'), 'Doe');
    await user.type(
      screen.getByPlaceholderText('Email address'),
      'jane@example.com'
    );
    await user.type(screen.getByPlaceholderText('Password'), 'Pass1234!');
    await user.type(screen.getByPlaceholderText('Repeat Password'), 'Pass1234!');

    fireEvent.focus(screen.getByPlaceholderText('Date'));
    fireEvent.click(screen.getByText('15'));
    fireEvent.focus(screen.getByPlaceholderText('Month'));
    fireEvent.click(screen.getByText('Jan'));
    fireEvent.focus(screen.getByPlaceholderText('Year'));
    fireEvent.click(screen.getByText(String(new Date().getFullYear() - 10)));

    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(notifyInProgress).toHaveBeenCalled();
    });
  });

  it('shows validation error when repeat password does not match', async () => {
    const user = userEvent.setup();

    render(<AuthInitSignUp />);

    await user.type(screen.getByPlaceholderText('Password'), 'Pass1234!');
    await user.type(screen.getByPlaceholderText('Repeat Password'), 'Different!');
    fireEvent.blur(screen.getByPlaceholderText('Repeat Password'));

    await waitFor(() => {
      expect(
        screen.getByText('Should match the password field')
      ).toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// AuthVerifyForm
// ---------------------------------------------------------------------------
describe('AuthVerifyForm', () => {
  const defaultProps = {
    username: 'user@test.com',
    password: 'Pass1234',
    setIsLoading: jest.fn(),
    onSuccess: jest.fn(),
    onIncorrectCredentials: jest.fn(),
  };

  it('renders verification code input and verify button', () => {
    render(<AuthVerifyForm {...defaultProps} />);
    expect(
      screen.getByPlaceholderText('Verification Code')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /verify/i })
    ).toBeInTheDocument();
  });

  it('displays the email the code was sent to', () => {
    render(<AuthVerifyForm {...defaultProps} />);
    expect(screen.getByText('user@test.com')).toBeInTheDocument();
  });

  it('renders the resend OTP button', () => {
    render(<AuthVerifyForm {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: /resend code/i })
    ).toBeInTheDocument();
  });

  it('calls signIn with confirmSignUp method on submit', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce({ ok: true });

    render(<AuthVerifyForm {...defaultProps} />);

    await user.type(
      screen.getByPlaceholderText('Verification Code'),
      '123456'
    );
    await user.click(screen.getByRole('button', { name: /verify/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        'credentials',
        expect.objectContaining({
          confirmationCode: '123456',
          redirect: false,
        }),
        { method: 'confirmSignUp' }
      );
    });
  });

  it('calls onSuccess when signIn succeeds', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce({ ok: true });

    render(<AuthVerifyForm {...defaultProps} />);

    await user.type(
      screen.getByPlaceholderText('Verification Code'),
      '123456'
    );
    await user.click(screen.getByRole('button', { name: /verify/i }));

    await waitFor(() => {
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('returns early when signIn resolves to null', async () => {
    const user = userEvent.setup();
    const setIsLoading = jest.fn();
    mockSignIn.mockResolvedValueOnce(null);

    render(<AuthVerifyForm {...defaultProps} setIsLoading={setIsLoading} />);

    await user.type(
      screen.getByPlaceholderText('Verification Code'),
      '123456'
    );
    await user.click(screen.getByRole('button', { name: /verify/i }));

    await waitFor(() => {
      expect(setIsLoading).toHaveBeenCalledWith(false);
    });
    expect(defaultProps.onSuccess).not.toHaveBeenCalled();
    expect(notifyError).not.toHaveBeenCalled();
  });

  it('notifies unknown error when signIn returns not ok without error', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce({ ok: false });

    render(<AuthVerifyForm {...defaultProps} />);

    await user.type(
      screen.getByPlaceholderText('Verification Code'),
      '123456'
    );
    await user.click(screen.getByRole('button', { name: /verify/i }));

    await waitFor(() => {
      expect(notifyError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: TOAST_UNKNOWN_ERROR_MESSAGE,
        })
      );
    });
  });

  it('calls notifyInProgress for JSON-parseable signIn errors', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce({
      ok: false,
      error: JSON.stringify({ code: 'LimitExceededException' }),
    });

    render(<AuthVerifyForm {...defaultProps} />);

    await user.type(
      screen.getByPlaceholderText('Verification Code'),
      '123456'
    );
    await user.click(screen.getByRole('button', { name: /verify/i }));

    await waitFor(() => {
      expect(notifyInProgress).toHaveBeenCalled();
    });
  });

  it('calls onIncorrectCredentials for invalid credentials error', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce({
      ok: false,
      error: INVALID_CREDENTIALS_MESSAGE,
    });

    render(<AuthVerifyForm {...defaultProps} />);

    await user.type(
      screen.getByPlaceholderText('Verification Code'),
      '000000'
    );
    await user.click(screen.getByRole('button', { name: /verify/i }));

    await waitFor(() => {
      expect(defaultProps.onIncorrectCredentials).toHaveBeenCalled();
    });
    expect(notifyError).toHaveBeenCalledWith(
      expect.objectContaining({ message: INVALID_CREDENTIALS_MESSAGE })
    );
  });
});

// ---------------------------------------------------------------------------
// AuthResendOTPBtn
// ---------------------------------------------------------------------------
describe('AuthResendOTPBtn', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders with countdown text initially', () => {
    render(<AuthResendOTPBtn username='user@test.com' />);
    const btn = screen.getByRole('button', { name: /resend code/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();
  });

  it('calls resendSignUpCode when clicked after countdown', async () => {
    (resendSignUpCode as jest.Mock).mockResolvedValueOnce({});
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<AuthResendOTPBtn username='user@test.com' />);

    jest.advanceTimersByTime(65000);

    await waitFor(() => {
      const btn = screen.getByRole('button', { name: /resend code/i });
      expect(btn).not.toBeDisabled();
    });

    await user.click(screen.getByRole('button', { name: /resend code/i }));

    await waitFor(() => {
      expect(resendSignUpCode).toHaveBeenCalledWith({
        username: 'user@test.com',
      });
    });
  });

  it('calls resetPassword when resetPasswordCode prop is true', async () => {
    (resetPassword as jest.Mock).mockResolvedValueOnce({});
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <AuthResendOTPBtn username='user@test.com' resetPasswordCode />
    );

    jest.advanceTimersByTime(65000);

    await waitFor(() => {
      const btn = screen.getByRole('button', { name: /resend code/i });
      expect(btn).not.toBeDisabled();
    });

    await user.click(screen.getByRole('button', { name: /resend code/i }));

    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith({
        username: 'user@test.com',
      });
    });
  });
});

// ---------------------------------------------------------------------------
// AuthInitForgotPassword
// ---------------------------------------------------------------------------
describe('AuthInitForgotPassword', () => {
  const handleVerificationCode = jest.fn();

  it('renders email field and send code button', () => {
    render(
      <AuthInitForgotPassword
        handleVerificationCode={handleVerificationCode}
      />
    );
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /send code/i })
    ).toBeInTheDocument();
  });

  it('renders the forgot password header', () => {
    render(
      <AuthInitForgotPassword
        handleVerificationCode={handleVerificationCode}
      />
    );
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
    expect(screen.getByText('Reset your password')).toBeInTheDocument();
  });

  it('calls resetPassword and handleVerificationCode on CONFIRM_RESET', async () => {
    const user = userEvent.setup();
    (resetPassword as jest.Mock).mockResolvedValueOnce({
      nextStep: {
        resetPasswordStep:
          FORM_STATE.CONFIRM_RESET_PASSWORD_WITH_CODE,
      },
    });

    render(
      <AuthInitForgotPassword
        handleVerificationCode={handleVerificationCode}
      />
    );

    await user.type(
      screen.getByPlaceholderText('Email address'),
      'user@test.com'
    );
    await user.click(screen.getByRole('button', { name: /send code/i }));

    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith({
        username: 'user@test.com',
      });
      expect(handleVerificationCode).toHaveBeenCalledWith('user@test.com');
    });
  });

  it('calls notifyAxiosError on resetPassword failure', async () => {
    const user = userEvent.setup();
    (resetPassword as jest.Mock).mockRejectedValueOnce(new Error('fail'));

    render(
      <AuthInitForgotPassword
        handleVerificationCode={handleVerificationCode}
      />
    );

    await user.type(
      screen.getByPlaceholderText('Email address'),
      'user@test.com'
    );
    await user.click(screen.getByRole('button', { name: /send code/i }));

    await waitFor(() => {
      expect(notifyAxiosError).toHaveBeenCalled();
    });
  });
});

// ---------------------------------------------------------------------------
// AuthFinishForgotPassword
// ---------------------------------------------------------------------------
describe('AuthFinishForgotPassword', () => {
  const handleResetDone = jest.fn();

  it('renders verification code, new password, repeat password fields', () => {
    render(
      <AuthFinishForgotPassword
        username='user@test.com'
        handleResetDone={handleResetDone}
      />
    );
    expect(
      screen.getByPlaceholderText('Verification Code')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('New Password')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Repeat Password')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /submit/i })
    ).toBeInTheDocument();
  });

  it('displays the email the code was sent to', () => {
    render(
      <AuthFinishForgotPassword
        username='user@test.com'
        handleResetDone={handleResetDone}
      />
    );
    expect(screen.getByText('user@test.com')).toBeInTheDocument();
  });

  it('renders the "Almost Done" header', () => {
    render(
      <AuthFinishForgotPassword
        username='user@test.com'
        handleResetDone={handleResetDone}
      />
    );
    expect(screen.getByText('Almost Done')).toBeInTheDocument();
    expect(screen.getByText('one last step')).toBeInTheDocument();
  });

  it('calls confirmResetPassword and handleResetDone on submit', async () => {
    const user = userEvent.setup();
    (confirmResetPassword as jest.Mock).mockResolvedValueOnce({});

    render(
      <AuthFinishForgotPassword
        username='user@test.com'
        handleResetDone={handleResetDone}
      />
    );

    await user.type(
      screen.getByPlaceholderText('Verification Code'),
      '123456'
    );
    await user.type(
      screen.getByPlaceholderText('New Password'),
      'NewPass123'
    );
    await user.type(
      screen.getByPlaceholderText('Repeat Password'),
      'NewPass123'
    );
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(confirmResetPassword).toHaveBeenCalledWith({
        username: 'user@test.com',
        confirmationCode: '123456',
        newPassword: 'NewPass123',
      });
      expect(handleResetDone).toHaveBeenCalled();
    });
  });

  it('calls notifyAxiosError on confirmResetPassword failure', async () => {
    const user = userEvent.setup();
    (confirmResetPassword as jest.Mock).mockRejectedValueOnce(
      new Error('fail')
    );

    render(
      <AuthFinishForgotPassword
        username='user@test.com'
        handleResetDone={handleResetDone}
      />
    );

    await user.type(
      screen.getByPlaceholderText('Verification Code'),
      '123456'
    );
    await user.type(
      screen.getByPlaceholderText('New Password'),
      'NewPass123'
    );
    await user.type(
      screen.getByPlaceholderText('Repeat Password'),
      'NewPass123'
    );
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(notifyAxiosError).toHaveBeenCalled();
    });
  });
});

// ---------------------------------------------------------------------------
// ForgotPassword (integration of Init + Finish)
// ---------------------------------------------------------------------------
describe('ForgotPassword', () => {
  it('initially shows AuthInitForgotPassword form', () => {
    render(<ForgotPassword />);
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
  });

  it('transitions to AuthFinishForgotPassword after sending code', async () => {
    const user = userEvent.setup();
    (resetPassword as jest.Mock).mockResolvedValueOnce({
      nextStep: {
        resetPasswordStep:
          FORM_STATE.CONFIRM_RESET_PASSWORD_WITH_CODE,
      },
    });

    render(<ForgotPassword />);

    await user.type(
      screen.getByPlaceholderText('Email address'),
      'user@test.com'
    );
    await user.click(screen.getByRole('button', { name: /send code/i }));

    await waitFor(() => {
      expect(screen.getByText('Almost Done')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Verification Code')
      ).toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// Signup (wrapper)
// ---------------------------------------------------------------------------
describe('Signup', () => {
  it('renders the sign-up form inside Signup wrapper', () => {
    render(<Signup />);
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(
      screen.getByText('Signup/Login to Neurodiversity Academy')
    ).toBeInTheDocument();
  });
});
