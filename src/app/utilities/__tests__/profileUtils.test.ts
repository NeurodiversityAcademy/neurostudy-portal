/**
 * @jest-environment node
 */
import getProfileSectionData from '@/app/utilities/profile/getProfileSectionData';
import { DEFAULT_USER } from '@/app/utilities/auth/constants';

describe('getProfileSectionData', () => {
  const mockUser = {
    ...DEFAULT_USER,
    FirstName: 'Alice',
    LastName: 'Smith',
    Age: 30,
    Email: 'test@example.com',
  };

  it('extracts only specified fields from user data', () => {
    const result = getProfileSectionData(mockUser, ['FirstName', 'Age']);
    expect(result).toEqual({ FirstName: 'Alice', Age: 30 });
  });

  it('returns undefined for fields not present in source', () => {
    const result = getProfileSectionData(mockUser, [
      'FirstName',
      'NonExistent' as keyof typeof mockUser,
    ]);
    expect(result).toEqual({ FirstName: 'Alice', NonExistent: undefined });
  });

  it('returns empty object when no fields specified', () => {
    const result = getProfileSectionData(mockUser, []);
    expect(result).toEqual({});
  });

  it('copies all specified fields preserving values', () => {
    const result = getProfileSectionData(mockUser, [
      'FirstName',
      'LastName',
      'Age',
    ]);
    expect(result).toEqual({
      FirstName: 'Alice',
      LastName: 'Smith',
      Age: 30,
    });
  });
});
