/**
 * @jest-environment node
 */

jest.mock('@/app/utilities/amplify/configure', () => ({}));

jest.mock('aws-amplify/auth', () => ({
  signUp: jest.fn(),
  resetPassword: jest.fn(),
  confirmResetPassword: jest.fn(),
  resendSignUpCode: jest.fn(),
  AuthError: class AuthError extends Error {
    constructor(params: { message: string; name: string }) {
      super(params.message);
      this.name = params.name;
    }
  },
}));

jest.mock('@/app/utilities/auth/createUser', () => jest.fn());

jest.mock('@/app/utilities/auth/responses', () => ({
  returnAuthError: jest.fn().mockImplementation((ex: unknown) => {
    const message = ex instanceof Error ? ex.message : 'Auth error';
    return new Response(
      JSON.stringify({ error: 'Bad Request', message }),
      { status: 400 }
    );
  }),
}));

import {
  signUp,
  resetPassword,
  confirmResetPassword,
  resendSignUpCode,
} from 'aws-amplify/auth';
import createUser from '@/app/utilities/auth/createUser';

const mockSignUp = signUp as jest.Mock;
const mockResetPassword = resetPassword as jest.Mock;
const mockConfirmResetPassword = confirmResetPassword as jest.Mock;
const mockResendSignUpCode = resendSignUpCode as jest.Mock;
const mockCreateUser = createUser as jest.Mock;

const makeRequest = (url: string, body: unknown): Request =>
  new Request(`http://localhost${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('POST /api/auth/signUp', () => {
  let POST: (request: Request) => Promise<Response>;

  beforeAll(async () => {
    POST = (await import('@/app/api/auth/signUp/route')).POST;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 on successful sign up', async () => {
    mockSignUp.mockResolvedValue({ isSignUpComplete: true });
    mockCreateUser.mockResolvedValue({ email: 'new@test.com' });

    const body = {
      username: 'new@test.com',
      password: 'Pass123!',
      options: {
        userAttributes: {
          given_name: 'John',
          family_name: 'Doe',
          birthdate: '1990-01-01',
          subscribed: '1',
        },
      },
    };

    const res = await POST(makeRequest('/api/auth/signUp', body));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual({ isSignUpComplete: true });
    expect(mockCreateUser).toHaveBeenCalledWith(
      { email: 'new@test.com', family_name: 'Doe', given_name: 'John' },
      { birthdate: '1990-01-01', subscribed: true }
    );
  });

  it('returns error when family_name is missing', async () => {
    const body = {
      username: 'new@test.com',
      password: 'Pass123!',
      options: {
        userAttributes: { given_name: 'John' },
      },
    };

    const res = await POST(makeRequest('/api/auth/signUp', body));

    expect(res.status).toBe(400);
  });

  it('returns error when given_name is missing', async () => {
    const body = {
      username: 'new@test.com',
      password: 'Pass123!',
      options: {
        userAttributes: { family_name: 'Doe' },
      },
    };

    const res = await POST(makeRequest('/api/auth/signUp', body));

    expect(res.status).toBe(400);
  });

  it('disables autoSignIn if provided', async () => {
    mockSignUp.mockResolvedValue({ isSignUpComplete: true });
    mockCreateUser.mockResolvedValue({});

    const body = {
      username: 'new@test.com',
      password: 'Pass123!',
      options: {
        autoSignIn: true,
        userAttributes: {
          given_name: 'John',
          family_name: 'Doe',
        },
      },
    };

    await POST(makeRequest('/api/auth/signUp', body));

    expect(mockSignUp).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({ autoSignIn: false }),
      })
    );
  });

  it('returns error when signUp throws', async () => {
    mockSignUp.mockRejectedValue(new Error('Cognito error'));

    const body = {
      username: 'new@test.com',
      password: 'Pass123!',
      options: {
        userAttributes: { given_name: 'John', family_name: 'Doe' },
      },
    };

    const res = await POST(makeRequest('/api/auth/signUp', body));

    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/resetPassword', () => {
  let POST: (request: Request) => Promise<Response>;

  beforeAll(async () => {
    POST = (await import('@/app/api/auth/resetPassword/route')).POST;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 on successful reset password', async () => {
    mockResetPassword.mockResolvedValue({
      isPasswordReset: false,
      nextStep: { resetPasswordStep: 'CONFIRM_RESET_PASSWORD_WITH_CODE' },
    });

    const res = await POST(
      makeRequest('/api/auth/resetPassword', { username: 'user@test.com' })
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.nextStep.resetPasswordStep).toBe(
      'CONFIRM_RESET_PASSWORD_WITH_CODE'
    );
  });

  it('returns error when resetPassword throws', async () => {
    mockResetPassword.mockRejectedValue(new Error('User not found'));

    const res = await POST(
      makeRequest('/api/auth/resetPassword', { username: 'bad@test.com' })
    );

    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/confirmResetPassword', () => {
  let POST: (request: Request) => Promise<Response>;

  beforeAll(async () => {
    POST = (await import('@/app/api/auth/confirmResetPassword/route')).POST;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 on successful confirm', async () => {
    mockConfirmResetPassword.mockResolvedValue({});

    const body = {
      username: 'user@test.com',
      confirmationCode: '123456',
      newPassword: 'NewPass123!',
    };

    const res = await POST(
      makeRequest('/api/auth/confirmResetPassword', body)
    );

    expect(res.status).toBe(200);
  });

  it('returns error when confirmResetPassword throws', async () => {
    mockConfirmResetPassword.mockRejectedValue(
      new Error('Invalid code')
    );

    const body = {
      username: 'user@test.com',
      confirmationCode: 'wrong',
      newPassword: 'NewPass123!',
    };

    const res = await POST(
      makeRequest('/api/auth/confirmResetPassword', body)
    );

    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});

describe('POST /api/auth/resendSignUpCode', () => {
  let POST: (request: Request) => Promise<Response>;

  beforeAll(async () => {
    POST = (await import('@/app/api/auth/resendSignUpCode/route')).POST;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 on successful resend', async () => {
    mockResendSignUpCode.mockResolvedValue({
      destination: 'u***@test.com',
      deliveryMedium: 'EMAIL',
    });

    const res = await POST(
      makeRequest('/api/auth/resendSignUpCode', { username: 'user@test.com' })
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.destination).toBe('u***@test.com');
  });

  it('returns error when resendSignUpCode throws', async () => {
    mockResendSignUpCode.mockRejectedValue(new Error('User not found'));

    const res = await POST(
      makeRequest('/api/auth/resendSignUpCode', { username: 'bad@test.com' })
    );

    expect(res.status).toBe(400);
  });
});
