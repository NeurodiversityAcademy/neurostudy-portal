/**
 * @jest-environment node
 */
jest.mock('axios');

import axios from 'axios';
import signUp from '../signUp';
import resetPassword from '../resetPassword';
import resendSignUpCode from '../resendSignUpCode';
import confirmResetPassword from '../confirmResetPassword';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('auth client utilities', () => {
  beforeEach(() => {
    mockedAxios.request.mockReset();
  });

  describe('signUp', () => {
    it('posts to /api/auth/signUp and returns response data', async () => {
      const response = {
        isSignUpComplete: false,
        userId: 'user-123',
        nextStep: { signUpStep: 'CONFIRM_SIGN_UP' },
      };
      mockedAxios.request.mockResolvedValue({ data: response });

      const input = {
        username: 'user@test.com',
        password: 'Password1!',
        options: { userAttributes: { email: 'user@test.com' } },
      };

      const result = await signUp(input);

      expect(mockedAxios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: '/api/auth/signUp',
          data: input,
        }),
      );
      expect(result).toEqual(response);
    });
  });

  describe('resetPassword', () => {
    it('posts to /api/auth/resetPassword and returns response data', async () => {
      const response = {
        isPasswordReset: false,
        nextStep: { resetPasswordStep: 'CONFIRM_RESET_PASSWORD_WITH_CODE' },
      };
      mockedAxios.request.mockResolvedValue({ data: response });

      const input = { username: 'user@test.com' };
      const result = await resetPassword(input);

      expect(mockedAxios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/auth/resetPassword',
          data: input,
        }),
      );
      expect(result).toEqual(response);
    });
  });

  describe('resendSignUpCode', () => {
    it('posts to /api/auth/resendSignUpCode and returns response data', async () => {
      const response = {
        destination: 'u***@test.com',
        deliveryMedium: 'EMAIL',
      };
      mockedAxios.request.mockResolvedValue({ data: response });

      const input = { username: 'user@test.com' };
      const result = await resendSignUpCode(input);

      expect(mockedAxios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/auth/resendSignUpCode',
          data: input,
        }),
      );
      expect(result).toEqual(response);
    });
  });

  describe('confirmResetPassword', () => {
    it('posts to /api/auth/confirmResetPassword', async () => {
      mockedAxios.request.mockResolvedValue({ data: undefined });

      const input = {
        username: 'user@test.com',
        confirmationCode: '123456',
        newPassword: 'NewPassword1!',
      };

      await confirmResetPassword(input);

      expect(mockedAxios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/auth/confirmResetPassword',
          data: input,
        }),
      );
    });
  });
});
