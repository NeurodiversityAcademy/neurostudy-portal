import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { UserWithEmailProps } from '@/app/interfaces/User';
import { MoodleCourse } from '@/app/interfaces/Moodle';

const mockGetUserProfile = jest.fn();
const mockSaveUserProfile = jest.fn();
const mockGetMoodleCourses = jest.fn();
const mockProcessProfileFormData = jest.fn();
const mockNotifySuccess = jest.fn();
const mockNotifyAxiosError = jest.fn();

let mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
}));

jest.mock('../getUser', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockGetUserProfile(...args),
}));

jest.mock('../saveUserProfile', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockSaveUserProfile(...args),
}));

jest.mock('../processProfileFormData', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockProcessProfileFormData(...args),
}));

jest.mock('../../moodle/getMoodleCourses', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockGetMoodleCourses(...args),
}));

jest.mock('../../common', () => ({
  notifySuccess: (...args: unknown[]) => mockNotifySuccess(...args),
  notifyAxiosError: (...args: unknown[]) => mockNotifyAxiosError(...args),
}));

import ProfileProvider, { useProfileContext } from '../ProfileProvider';

const mockUser: UserWithEmailProps = {
  Email: 'user@test.com',
  FirstName: 'Jane',
  LastName: 'Doe',
};

const mockCourses: MoodleCourse[] = [
  {
    id: 1,
    href: '/moodle/course/1',
    shortname: 'ND101',
    fullname: 'Neurodiversity 101',
    displayname: 'Neurodiversity 101',
    summary: '',
    summaryformat: 1,
    startdate: 0,
    enddate: 0,
    visible: true,
  },
];

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ProfileProvider>{children}</ProfileProvider>
);

describe('ProfileProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    mockGetUserProfile.mockResolvedValue(mockUser);
    mockGetMoodleCourses.mockResolvedValue(mockCourses);
    mockSaveUserProfile.mockResolvedValue(undefined);
    mockProcessProfileFormData.mockImplementation((data) => data);
  });

  it('throws when useProfileContext is used outside the provider', () => {
    expect(() => renderHook(() => useProfileContext())).toThrow(
      'deviseContext()[1](derivative of `useContext`) does not have proper context.',
    );
  });

  it('loads profile and moodle courses on mount', async () => {
    const { result } = renderHook(() => useProfileContext(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetUserProfile).toHaveBeenCalledTimes(1);
    expect(mockGetMoodleCourses).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(mockUser);
    expect(result.current.courses).toEqual(mockCourses);
  });

  it('initializes isEditing from search params', async () => {
    mockSearchParams = new URLSearchParams('edit=1');

    const { result } = renderHook(() => useProfileContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isEditing).toBe(true);
  });

  it('saveData persists profile, merges data, and notifies success', async () => {
    const onSuccess = jest.fn();
    const formPayload = { FirstName: 'Updated' };
    const processedPayload = { FirstName: 'Updated' };

    mockProcessProfileFormData.mockReturnValue(processedPayload);

    const { result } = renderHook(() => useProfileContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockUser);
    });

    await act(async () => {
      await result.current.saveData(formPayload, onSuccess);
    });

    expect(mockProcessProfileFormData).toHaveBeenCalledWith(formPayload);
    expect(mockSaveUserProfile).toHaveBeenCalledWith(processedPayload);
    expect(result.current.data).toEqual({
      ...mockUser,
      ...processedPayload,
    });
    expect(mockNotifySuccess).toHaveBeenCalledWith('Profile successfully saved.');
    expect(onSuccess).toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it('saveData notifies axios error when save fails', async () => {
    const saveError = new Error('Save failed');
    mockSaveUserProfile.mockRejectedValue(saveError);

    const { result } = renderHook(() => useProfileContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockUser);
    });

    await act(async () => {
      await result.current.saveData({ FirstName: 'Fail' });
    });

    expect(mockNotifyAxiosError).toHaveBeenCalledWith(saveError);
    expect(mockNotifySuccess).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it('syncs isEditing when search params change', async () => {
    mockSearchParams = new URLSearchParams();

    const { result, rerender } = renderHook(() => useProfileContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isEditing).toBe(false);

    mockSearchParams = new URLSearchParams('edit=1');
    rerender();

    await waitFor(() => {
      expect(result.current.isEditing).toBe(true);
    });
  });
});
