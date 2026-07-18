/**
 * @jest-environment node
 */
jest.mock('axios');

import axios from 'axios';
import { registerCRMContact } from '../registerCRMContact';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('registerCRMContact', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    mockedAxios.request.mockReset();
    process.env = {
      ...originalEnv,
      CRM_BASE_URL: 'https://crm.example.com',
      CRM_ACCESS_KEY: 'test-access-key',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('creates a CRM contact and returns id metadata', async () => {
    mockedAxios.request.mockResolvedValue({
      data: {
        id: 'contact-123',
        updatedAt: '2026-01-01T00:00:00Z',
        createdAt: '2026-01-01T00:00:00Z',
      },
    });

    const contact = {
      firstname: 'Jane',
      lastname: 'Doe',
      email: 'jane@example.com',
    };

    const result = await registerCRMContact(contact);

    expect(mockedAxios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'post',
        url: 'https://crm.example.com/objects/contacts',
        headers: expect.objectContaining({
          authorization: 'Bearer test-access-key',
          'content-type': 'application/json',
        }),
        data: JSON.stringify({ properties: contact }),
      }),
    );
    expect(result).toEqual({
      id: 'contact-123',
      updatedAt: '2026-01-01T00:00:00Z',
      createdAt: '2026-01-01T00:00:00Z',
    });
  });

  it('returns false when the CRM request fails', async () => {
    mockedAxios.request.mockRejectedValue(new Error('CRM unavailable'));
    const spy = jest.spyOn(console, 'log').mockImplementation();

    const result = await registerCRMContact({
      firstname: 'Fail',
      email: 'fail@example.com',
    });

    expect(result).toBe(false);
    spy.mockRestore();
  });
});
