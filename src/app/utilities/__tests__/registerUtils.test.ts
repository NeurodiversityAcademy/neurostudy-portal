jest.mock('axios');

import axios from 'axios';
import { registerContactData } from '@/app/utilities/register/registerContactData';
import { registerTeacherData } from '@/app/utilities/register/registerTeacherData';
import { registerSubscriptionData } from '@/app/utilities/register/registerSubscriptionData';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('register utilities', () => {
  beforeEach(() => {
    mockedAxios.request.mockReset();
  });

  describe('registerContactData', () => {
    it('sends POST to /api/contactUsSubmission with contact data', async () => {
      const mockResponse = { data: { id: '123' } };
      mockedAxios.request.mockResolvedValue(mockResponse);

      const contactData = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        hs_persona: 'persona_1',
      };

      const result = await registerContactData(contactData as any);

      expect(mockedAxios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: '/api/contactUsSubmission',
          data: JSON.stringify(contactData),
        }),
      );
      expect(result).toEqual({ id: '123' });
    });

    it('handles errors gracefully', async () => {
      mockedAxios.request.mockRejectedValue(new Error('Network error'));
      const spy = jest.spyOn(console, 'log').mockImplementation();

      const result = await registerContactData({} as any);

      expect(result).toBeUndefined();
      spy.mockRestore();
    });
  });

  describe('registerTeacherData', () => {
    it('sends POST to /api/teacherRegistration with teacher data', async () => {
      const mockResponse = { data: { id: '456' } };
      mockedAxios.request.mockResolvedValue(mockResponse);

      const teacherData = {
        firstname: 'Jane',
        lastname: 'Smith',
        email: 'jane@school.edu',
        phone: '0412345678',
      };

      const result = await registerTeacherData(teacherData as any);

      expect(mockedAxios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: '/api/teacherRegistration',
        }),
      );
      expect(result).toEqual({ id: '456' });
    });

    it('handles errors gracefully', async () => {
      mockedAxios.request.mockRejectedValue(new Error('Timeout'));
      const spy = jest.spyOn(console, 'log').mockImplementation();

      const result = await registerTeacherData({} as any);

      expect(result).toBeUndefined();
      spy.mockRestore();
    });
  });

  describe('registerSubscriptionData', () => {
    it('sends POST to /api/userSubscription', async () => {
      const mockResponse = { data: { subscribed: true } };
      mockedAxios.request.mockResolvedValue(mockResponse);

      const subData = { email: 'sub@example.com' };
      const result = await registerSubscriptionData(subData as any);

      expect(mockedAxios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'post',
          url: '/api/userSubscription',
        }),
      );
      expect(result).toEqual({ subscribed: true });
    });

    it('adds responseType blob when getHandbook is present', async () => {
      const mockBlob = new Blob(['pdf content']);
      const mockResponse = { data: mockBlob };
      mockedAxios.request.mockResolvedValue(mockResponse);

      window.URL.createObjectURL = jest.fn(() => 'blob:url');
      window.URL.revokeObjectURL = jest.fn();

      const subData = { email: 'sub@example.com', getHandbook: true };
      await registerSubscriptionData(subData as any);

      expect(mockedAxios.request).toHaveBeenCalledWith(
        expect.objectContaining({
          responseType: 'blob',
        }),
      );
    });

    it('downloads handbook blob when response is a Blob', async () => {
      const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' });
      mockedAxios.request.mockResolvedValue({ data: mockBlob });

      const clickSpy = jest
        .spyOn(HTMLAnchorElement.prototype, 'click')
        .mockImplementation(() => undefined);
      window.URL.createObjectURL = jest.fn(() => 'blob:url');
      window.URL.revokeObjectURL = jest.fn();

      const result = await registerSubscriptionData({
        email: 'sub@example.com',
        getHandbook: true,
      } as any);

      expect(result).toBe(mockBlob);
      expect(window.URL.createObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(clickSpy).toHaveBeenCalled();
      clickSpy.mockRestore();
    });

    it('handles errors gracefully', async () => {
      mockedAxios.request.mockRejectedValue(new Error('Error'));
      const spy = jest.spyOn(console, 'log').mockImplementation();

      const result = await registerSubscriptionData({ email: 'x@y.com' } as any);

      expect(result).toBeUndefined();
      spy.mockRestore();
    });
  });
});
