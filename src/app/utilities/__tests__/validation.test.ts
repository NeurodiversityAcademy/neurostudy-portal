/**
 * @jest-environment node
 */
import { isValidContactUsFormData } from '@/app/utilities/validation/validateContactUsFormData';
import { isValidTeacherRegistrationData } from '@/app/utilities/validation/validateTeacherRegistrationData';
import { isValidUserSubscriptionData } from '@/app/utilities/validation/validateUserSubscriptionData';
import assertCourseData from '@/app/utilities/validation/assertCourseData';
import assertUserProps from '@/app/utilities/validation/assertUserData';
import assertCourseDetails from '@/app/utilities/validation/assertCourseDetailsData';
import assertCourseWithoutIdData from '@/app/utilities/validation/assertCourseWithoutIdData';

interface ThrownAPIError extends Error {
  status: number;
}

const expectAPIError = (fn: () => void, messagePattern?: string | RegExp) => {
  try {
    fn();
    throw new Error('Expected function to throw');
  } catch (e) {
    const err = e as ThrownAPIError;
    expect(err).toBeInstanceOf(Error);
    expect(err.status).toBe(400);
    if (messagePattern) {
      if (typeof messagePattern === 'string') {
        expect(err.message).toBe(messagePattern);
      } else {
        expect(err.message).toMatch(messagePattern);
      }
    }
  }
};

jest.mock('@/app/utilities/db/constants', () => ({
  DEFAULT_COURSE: {
    CourseId: 'abc123',
    Title: 'Test Course',
    Duration: 12,
    Rating: 4.5,
  },
  DEFAULT_COURSE_WITHOUT_ID: {
    Title: 'Test Course',
    Duration: 12,
    Rating: 4.5,
  },
  DEFAULT_COURSE_DETAILS: {
    CourseId: 'abc123',
    Title: 'Test Course',
    Duration: 12,
    Rating: 4.5,
  },
}));

jest.mock('@/app/utilities/auth/constants', () => ({
  DEFAULT_USER: {
    FirstName: '',
    LastName: '',
    Age: 0,
    Subscribed: false,
  },
}));

describe('isValidContactUsFormData', () => {
  const validData = {
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    hs_persona: 'persona_1',
  };

  it('returns true for valid data without phone', () => {
    expect(isValidContactUsFormData(validData)).toBe(true);
  });

  it('returns true for valid data with valid phone', () => {
    expect(isValidContactUsFormData({ ...validData, phone: '0412345678' })).toBe(true);
  });

  it('returns true for valid data with +61 phone format', () => {
    expect(isValidContactUsFormData({ ...validData, phone: '+61412345678' })).toBe(true);
  });

  it('returns false when firstname is missing', () => {
    const { firstname: _firstname, ...rest } = validData;
    expect(isValidContactUsFormData(rest)).toBe(false);
  });

  it('returns false when lastname is missing', () => {
    const { lastname: _lastname, ...rest } = validData;
    expect(isValidContactUsFormData(rest)).toBe(false);
  });

  it('returns false when email is missing', () => {
    const { email: _email, ...rest } = validData;
    expect(isValidContactUsFormData(rest)).toBe(false);
  });

  it('returns false when hs_persona is missing', () => {
    const { hs_persona: _hs_persona, ...rest } = validData;
    expect(isValidContactUsFormData(rest)).toBe(false);
  });

  it('returns false for invalid email (no @)', () => {
    expect(isValidContactUsFormData({ ...validData, email: 'johnexample.com' })).toBe(false);
  });

  it('returns false for invalid email (no domain)', () => {
    expect(isValidContactUsFormData({ ...validData, email: 'john@' })).toBe(false);
  });

  it('returns false for invalid email (no TLD)', () => {
    expect(isValidContactUsFormData({ ...validData, email: 'john@example' })).toBe(false);
  });

  it('returns false for invalid phone number', () => {
    expect(isValidContactUsFormData({ ...validData, phone: '123' })).toBe(false);
  });

  it('returns false for phone starting with 0 or 1', () => {
    expect(isValidContactUsFormData({ ...validData, phone: '0112345678' })).toBe(false);
  });

  it('returns true for valid email with subdomain TLD', () => {
    expect(isValidContactUsFormData({ ...validData, email: 'user@mail.co.uk' })).toBe(true);
  });
});

describe('isValidTeacherRegistrationData', () => {
  const validData = {
    firstname: 'Jane',
    lastname: 'Smith',
    email: 'jane@school.edu.au',
    phone: '0298765432',
  };

  it('returns true for valid data', () => {
    expect(isValidTeacherRegistrationData(validData)).toBe(true);
  });

  it('returns false when firstname is missing', () => {
    const { firstname: _firstname, ...rest } = validData;
    expect(isValidTeacherRegistrationData(rest)).toBe(false);
  });

  it('returns false when lastname is missing', () => {
    const { lastname: _lastname, ...rest } = validData;
    expect(isValidTeacherRegistrationData(rest)).toBe(false);
  });

  it('returns false when email is missing', () => {
    const { email: _email, ...rest } = validData;
    expect(isValidTeacherRegistrationData(rest)).toBe(false);
  });

  it('returns false for invalid firstname with special chars', () => {
    expect(isValidTeacherRegistrationData({ ...validData, firstname: 'J@ne!' })).toBe(false);
  });

  it('returns false for invalid lastname with special chars', () => {
    expect(isValidTeacherRegistrationData({ ...validData, lastname: 'Sm!th#' })).toBe(false);
  });

  it('returns true for name with dots and hyphens', () => {
    expect(
      isValidTeacherRegistrationData({
        ...validData,
        firstname: 'Mary-Jane',
        lastname: 'St. Clair',
      }),
    ).toBe(true);
  });

  it('returns true for name with numbers', () => {
    expect(
      isValidTeacherRegistrationData({
        ...validData,
        firstname: 'Test2',
      }),
    ).toBe(true);
  });

  it('returns false for invalid email format', () => {
    expect(isValidTeacherRegistrationData({ ...validData, email: 'not-an-email' })).toBe(false);
  });

  it('returns false for invalid phone (too short)', () => {
    expect(isValidTeacherRegistrationData({ ...validData, phone: '041234' })).toBe(false);
  });

  it('returns false for invalid phone (starts with 1)', () => {
    expect(isValidTeacherRegistrationData({ ...validData, phone: '0112345678' })).toBe(false);
  });

  it('returns true for phone with +61 prefix', () => {
    expect(isValidTeacherRegistrationData({ ...validData, phone: '+61298765432' })).toBe(true);
  });

  it('returns false when phone is undefined', () => {
    const { phone: _phone, ...rest } = validData;
    expect(isValidTeacherRegistrationData(rest)).toBe(false);
  });
});

describe('isValidUserSubscriptionData', () => {
  it('returns true for valid email', () => {
    expect(isValidUserSubscriptionData({ email: 'user@example.com' })).toBe(true);
  });

  it('returns true for email with subdomain TLD', () => {
    expect(isValidUserSubscriptionData({ email: 'a@b.co.uk' })).toBe(true);
  });

  it('returns false when email key is missing', () => {
    expect(isValidUserSubscriptionData({})).toBe(false);
  });

  it('returns false for invalid email (no @)', () => {
    expect(isValidUserSubscriptionData({ email: 'userexample.com' })).toBe(false);
  });

  it('returns false for invalid email (no TLD)', () => {
    expect(isValidUserSubscriptionData({ email: 'user@example' })).toBe(false);
  });

  it('returns false for empty string email', () => {
    expect(isValidUserSubscriptionData({ email: '' })).toBe(false);
  });

  it('returns false for email with spaces', () => {
    expect(isValidUserSubscriptionData({ email: 'user @example.com' })).toBe(false);
  });

  it('returns true for email with dots in local part', () => {
    expect(isValidUserSubscriptionData({ email: 'first.last@example.com' })).toBe(true);
  });

  it('returns true for email with plus sign', () => {
    expect(isValidUserSubscriptionData({ email: 'user+tag@example.com' })).toBe(true);
  });
});

describe('assertCourseData', () => {
  const validCourse = {
    CourseId: 'xyz',
    Title: 'Some Title',
    Duration: 6,
    Rating: 3.0,
  };

  it('does not throw for valid course array', () => {
    expect(() => assertCourseData([validCourse])).not.toThrow();
  });

  it('does not throw for empty array', () => {
    expect(() => assertCourseData([])).not.toThrow();
  });

  it('throws for non-array input', () => {
    expectAPIError(
      () => assertCourseData({} as unknown as Record<string, unknown>[]),
      'Invalid request payload, expected a JSON array.',
    );
  });

  it('throws for string input', () => {
    expectAPIError(
      () => assertCourseData('string' as unknown as Record<string, unknown>[]),
      'Invalid request payload, expected a JSON array.',
    );
  });

  it('throws for null item in array', () => {
    expectAPIError(
      () => assertCourseData([null] as unknown as Record<string, unknown>[]),
      'Invalid item (index no. "0") supplied.',
    );
  });

  it('throws for non-object item in array', () => {
    expectAPIError(
      () => assertCourseData(['str'] as unknown as Record<string, unknown>[]),
      'Invalid item (index no. "0") supplied.',
    );
  });

  it('throws for type mismatch (string instead of number)', () => {
    expectAPIError(
      () => assertCourseData([{ ...validCourse, Duration: 'twelve' }]),
      /Invalid prop 'item\[0\]\["Duration"\]'.*expected 'number'/,
    );
  });

  it('throws for type mismatch (number instead of string)', () => {
    expectAPIError(
      () => assertCourseData([{ ...validCourse, Title: 123 }]),
      /Invalid prop 'item\[0\]\["Title"\]'.*expected 'string'/,
    );
  });

  it('throws for unknown key', () => {
    expectAPIError(
      () => assertCourseData([{ ...validCourse, UnknownField: 'test' }]),
      /Invalid prop key 'UnknownField' found in 'item\[0\]'/,
    );
  });

  it('reports correct index for invalid item at position 1', () => {
    expectAPIError(
      () => assertCourseData([validCourse, null as unknown as Record<string, unknown>]),
      'Invalid item (index no. "1") supplied.',
    );
  });

  it('does not throw for subset of valid keys', () => {
    expect(() => assertCourseData([{ Title: 'Only Title' }])).not.toThrow();
  });

  it('error has status 400', () => {
    expectAPIError(() => assertCourseData('bad' as unknown as Record<string, unknown>[]));
  });
});

describe('assertUserProps', () => {
  const validUser = {
    FirstName: 'Alice',
    LastName: 'Doe',
    Age: 25,
    Subscribed: true,
  };

  it('does not throw for valid user object', () => {
    expect(() => assertUserProps(validUser as any)).not.toThrow();
  });

  it('does not throw for empty object', () => {
    expect(() => assertUserProps({} as any)).not.toThrow();
  });

  it('throws for null input', () => {
    expectAPIError(() => assertUserProps(null as any), /expected an object with key-value pairs/);
  });

  it('throws for undefined input', () => {
    expectAPIError(() => assertUserProps(undefined as any));
  });

  it('throws for non-object input (string)', () => {
    expectAPIError(() => assertUserProps('string' as any));
  });

  it('throws for non-object input (number)', () => {
    expectAPIError(() => assertUserProps(42 as any));
  });

  it('throws for type mismatch (number for string)', () => {
    expectAPIError(
      () => assertUserProps({ ...validUser, FirstName: 123 } as any),
      /Invalid prop 'user\["FirstName"\]'.*expected 'string'/,
    );
  });

  it('throws for type mismatch (string for number)', () => {
    expectAPIError(
      () => assertUserProps({ ...validUser, Age: 'twenty' } as any),
      /Invalid prop 'user\["Age"\]'.*expected 'number'/,
    );
  });

  it('throws for type mismatch (string for boolean)', () => {
    expectAPIError(
      () => assertUserProps({ ...validUser, Subscribed: 'yes' } as any),
      /Invalid prop 'user\["Subscribed"\]'.*expected 'boolean'/,
    );
  });

  it('throws for unknown key', () => {
    expectAPIError(
      () => assertUserProps({ ...validUser, RandomKey: 'val' } as any),
      /Invalid prop key 'RandomKey' found in 'user'/,
    );
  });

  it('error has status 400', () => {
    expectAPIError(() => assertUserProps(null as any));
  });
});

describe('assertCourseDetails', () => {
  const validDetails = {
    CourseId: 'crs1',
    Title: 'Introduction to AI',
    Duration: 8,
    Rating: 4.2,
  };

  it('does not throw for valid course details', () => {
    expect(() => assertCourseDetails(validDetails)).not.toThrow();
  });

  it('does not throw for empty object', () => {
    expect(() => assertCourseDetails({})).not.toThrow();
  });

  it('throws for null input', () => {
    expectAPIError(() => assertCourseDetails(null), /expected an object with key-value pairs/);
  });

  it('throws for undefined input', () => {
    expectAPIError(() => assertCourseDetails(undefined));
  });

  it('throws for non-object (string)', () => {
    expectAPIError(() => assertCourseDetails('test'));
  });

  it('throws for non-object (number)', () => {
    expectAPIError(() => assertCourseDetails(99));
  });

  it('throws for type mismatch (string for number)', () => {
    expectAPIError(
      () => assertCourseDetails({ ...validDetails, Duration: 'long' }),
      /Invalid prop 'courseDetails\["Duration"\]'.*expected 'number'/,
    );
  });

  it('throws for type mismatch (number for string)', () => {
    expectAPIError(
      () => assertCourseDetails({ ...validDetails, Title: 42 }),
      /Invalid prop 'courseDetails\["Title"\]'.*expected 'string'/,
    );
  });

  it('throws for unknown key', () => {
    expectAPIError(
      () => assertCourseDetails({ ...validDetails, Bogus: true }),
      /Invalid prop key 'Bogus' found in 'courseDetails'/,
    );
  });

  it('error has status 400', () => {
    expectAPIError(() => assertCourseDetails(null));
  });

  it('does not throw for a subset of valid keys', () => {
    expect(() => assertCourseDetails({ Title: 'Only' })).not.toThrow();
  });
});

describe('assertCourseWithoutIdData', () => {
  const validItem = {
    Title: 'Design Thinking',
    Duration: 16,
    Rating: 4.8,
  };

  it('does not throw for valid array', () => {
    expect(() => assertCourseWithoutIdData([validItem] as any)).not.toThrow();
  });

  it('does not throw for empty array', () => {
    expect(() => assertCourseWithoutIdData([] as any)).not.toThrow();
  });

  it('throws for non-array input', () => {
    expectAPIError(
      () => assertCourseWithoutIdData({} as any),
      'Invalid request payload, expected a JSON array.',
    );
  });

  it('throws for null item in array', () => {
    expectAPIError(
      () => assertCourseWithoutIdData([null] as any),
      'Invalid item (index no. "0") supplied.',
    );
  });

  it('throws for non-object item', () => {
    expectAPIError(
      () => assertCourseWithoutIdData([42] as any),
      'Invalid item (index no. "0") supplied.',
    );
  });

  it('throws for type mismatch', () => {
    expectAPIError(
      () => assertCourseWithoutIdData([{ ...validItem, Duration: 'long' }] as any),
      /Invalid prop 'item\[0\]\["Duration"\]'.*expected 'number'/,
    );
  });

  it('throws for unknown key', () => {
    expectAPIError(
      () => assertCourseWithoutIdData([{ ...validItem, Foo: 'bar' }] as any),
      /Invalid prop key 'Foo' found in 'item\[0\]'/,
    );
  });

  it('reports correct index for second item failure', () => {
    expectAPIError(
      () => assertCourseWithoutIdData([validItem, null] as any),
      'Invalid item (index no. "1") supplied.',
    );
  });

  it('error has status 400', () => {
    expectAPIError(() => assertCourseWithoutIdData('bad' as any));
  });

  it('does not throw for subset of valid keys', () => {
    expect(() => assertCourseWithoutIdData([{ Title: 'Only Title' }] as any)).not.toThrow();
  });
});
