import { processTier } from '../course/processTier';
import extractCourseSortConfig from '../course/extractSortConfig';
import { filterCourses, sortCourses } from '../course/helper';
import { CourseProps, CourseSortConfig } from '@/app/interfaces/Course';

jest.mock('../db/constants', () => ({
  DEFAULT_COURSE: {
    CourseId: 'azAz1.!',
    Title: 'Bachelor of Laws',
    Duration: 24,
    Rating: 3.9,
    InstitutionName: 'Central Queensland University',
    Tier: 'GOLD',
    Location: 'Sydney',
    Level: 'MASTERS',
    InterestArea: 'Cyber Security',
    Mode: 'Hybrid',
    Neurotypes: [''],
  },
  COURSE_TABLE_PARTITION_KEY: 'CourseId',
}));

jest.mock('../course/constants', () => ({
  DEFAULT_COURSE_SORT_BY: 'Title',
  DEFAULT_COURSE_SORT_ORDER: 1,
  CourseTierValue: {
    GOLD: 3,
    SILVER: 2,
    BRONZE: 1,
  },
}));

describe('processTier', () => {
  it('returns undefined when no argument is passed', () => {
    expect(processTier()).toBeUndefined();
  });

  it('returns undefined for empty string', () => {
    expect(processTier('')).toBeUndefined();
  });

  it('returns GOLD for case-insensitive "gold"', () => {
    expect(processTier('gold')).toBe('GOLD');
    expect(processTier('GOLD')).toBe('GOLD');
    expect(processTier('Gold')).toBe('GOLD');
    expect(processTier('gOlD')).toBe('GOLD');
  });

  it('returns SILVER for case-insensitive "silver"', () => {
    expect(processTier('silver')).toBe('SILVER');
    expect(processTier('SILVER')).toBe('SILVER');
    expect(processTier('Silver')).toBe('SILVER');
  });

  it('returns BRONZE for case-insensitive "bronze"', () => {
    expect(processTier('bronze')).toBe('BRONZE');
    expect(processTier('BRONZE')).toBe('BRONZE');
    expect(processTier('Bronze')).toBe('BRONZE');
  });

  it('returns undefined for unrecognized tier values', () => {
    expect(processTier('platinum')).toBeUndefined();
    expect(processTier('diamond')).toBeUndefined();
    expect(processTier('random')).toBeUndefined();
  });
});

describe('extractCourseSortConfig', () => {
  it('returns defaults when no arguments provided', () => {
    const result = extractCourseSortConfig({});
    expect(result).toEqual({ sortBy: 'Title', sortOrder: 1 });
  });

  it('returns defaults for null sortBy and sortOrder', () => {
    const result = extractCourseSortConfig({ sortBy: null, sortOrder: null });
    expect(result).toEqual({ sortBy: 'Title', sortOrder: 1 });
  });

  it('accepts a valid sortBy key that exists in DEFAULT_COURSE', () => {
    const result = extractCourseSortConfig({ sortBy: 'Duration' });
    expect(result.sortBy).toBe('Duration');
  });

  it('falls back to default sortBy for an invalid key', () => {
    const result = extractCourseSortConfig({ sortBy: 'NonExistentField' });
    expect(result.sortBy).toBe('Title');
  });

  it('accepts sortOrder 1 (ascending)', () => {
    const result = extractCourseSortConfig({ sortOrder: '1' });
    expect(result.sortOrder).toBe(1);
  });

  it('accepts sortOrder -1 (descending)', () => {
    const result = extractCourseSortConfig({ sortOrder: '-1' });
    expect(result.sortOrder).toBe(-1);
  });

  it('accepts numeric sortOrder directly', () => {
    const result = extractCourseSortConfig({ sortOrder: -1 });
    expect(result.sortOrder).toBe(-1);
  });

  it('falls back to default sortOrder for invalid values', () => {
    const result = extractCourseSortConfig({ sortOrder: '5' });
    expect(result.sortOrder).toBe(1);
  });

  it('falls back to default sortOrder for 0', () => {
    const result = extractCourseSortConfig({ sortOrder: '0' });
    expect(result.sortOrder).toBe(1);
  });

  it('handles combined valid sortBy and sortOrder', () => {
    const result = extractCourseSortConfig({
      sortBy: 'Rating',
      sortOrder: '-1',
    });
    expect(result).toEqual({ sortBy: 'Rating', sortOrder: -1 });
  });
});

describe('filterCourses', () => {
  const courses = [
    {
      CourseId: '1',
      Title: 'Bachelor of Computer Science',
      InstitutionName: 'University of Melbourne',
      Location: 'Melbourne',
      Neurotypes: ['Autism', 'ADHD'],
      InterestArea: 'Computer Science',
      Level: 'BACHELORS',
      Mode: 'On-campus',
    },
    {
      CourseId: '2',
      Title: 'Master of Psychology',
      InstitutionName: 'University of Sydney',
      Location: 'Sydney',
      Neurotypes: ['Dyslexia'],
      InterestArea: 'Psychology',
      Level: 'MASTERS',
      Mode: 'Online',
    },
    {
      CourseId: '3',
      Title: 'Bachelor of Education',
      InstitutionName: 'University of Melbourne',
      Location: 'Melbourne',
      Neurotypes: ['ADHD', 'Dyspraxia'],
      InterestArea: 'Education',
      Level: 'BACHELORS',
      Mode: 'Hybrid',
    },
  ] as unknown as CourseProps[];

  it('returns all courses when filterEntries is empty', () => {
    const result = filterCourses(courses, []);
    expect(result).toHaveLength(3);
  });

  it('filters by a single string field', () => {
    const result = filterCourses(courses, [['Location', ['Melbourne']]]);
    expect(result).toHaveLength(2);
    expect(result[0].CourseId).toBe('1');
    expect(result[1].CourseId).toBe('3');
  });

  it('filters by array field (Neurotypes)', () => {
    const result = filterCourses(courses, [['Neurotypes', ['ADHD']]]);
    expect(result).toHaveLength(2);
  });

  it('filters with multiple entries (all must match)', () => {
    const result = filterCourses(courses, [
      ['Location', ['Melbourne']],
      ['Level', ['BACHELORS']],
    ]);
    expect(result).toHaveLength(2);
  });

  it('returns empty when no courses match', () => {
    const result = filterCourses(courses, [['Location', ['Perth']]]);
    expect(result).toHaveLength(0);
  });

  it('is case-insensitive in matching', () => {
    const result = filterCourses(courses, [['Location', ['melbourne']]]);
    expect(result).toHaveLength(2);
  });

  it('matches partial multi-word queries', () => {
    const result = filterCourses(courses, [
      ['Title', ['bachelor computer']],
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].CourseId).toBe('1');
  });

  it('returns all when query array is empty for a key', () => {
    const result = filterCourses(courses, [['Location', []]]);
    expect(result).toHaveLength(3);
  });
});

describe('sortCourses', () => {
  const courses = [
    {
      CourseId: '1',
      Title: 'Alpha Course',
      Rating: 3.5,
      Duration: 36,
      Tier: 'BRONZE',
    },
    {
      CourseId: '2',
      Title: 'Charlie Course',
      Rating: 4.5,
      Duration: 12,
      Tier: 'GOLD',
    },
    {
      CourseId: '3',
      Title: 'Beta Course',
      Rating: 4.0,
      Duration: 24,
      Tier: 'SILVER',
    },
  ] as unknown as CourseProps[];

  it('returns data unchanged when no config provided', () => {
    const result = sortCourses([...courses]);
    expect(result).toEqual(courses);
  });

  it('sorts by Title ascending', () => {
    const config: CourseSortConfig = { sortBy: 'Title', sortOrder: 1 };
    const result = sortCourses([...courses], config);
    expect(result[0].Title).toBe('Alpha Course');
    expect(result[1].Title).toBe('Beta Course');
    expect(result[2].Title).toBe('Charlie Course');
  });

  it('sorts by Title descending', () => {
    const config: CourseSortConfig = { sortBy: 'Title', sortOrder: -1 };
    const result = sortCourses([...courses], config);
    expect(result[0].Title).toBe('Charlie Course');
    expect(result[1].Title).toBe('Beta Course');
    expect(result[2].Title).toBe('Alpha Course');
  });

  it('sorts by numeric field (Rating) ascending', () => {
    const config: CourseSortConfig = { sortBy: 'Rating', sortOrder: 1 };
    const result = sortCourses([...courses], config);
    expect(result[0].Rating).toBe(3.5);
    expect(result[1].Rating).toBe(4.0);
    expect(result[2].Rating).toBe(4.5);
  });

  it('sorts by numeric field (Rating) descending', () => {
    const config: CourseSortConfig = { sortBy: 'Rating', sortOrder: -1 };
    const result = sortCourses([...courses], config);
    expect(result[0].Rating).toBe(4.5);
    expect(result[1].Rating).toBe(4.0);
    expect(result[2].Rating).toBe(3.5);
  });

  it('sorts by Tier using special CourseTierValue mapping', () => {
    const config: CourseSortConfig = { sortBy: 'Tier', sortOrder: 1 };
    const result = sortCourses([...courses], config);
    expect(result[0].Tier).toBe('BRONZE');
    expect(result[1].Tier).toBe('SILVER');
    expect(result[2].Tier).toBe('GOLD');
  });

  it('sorts by Tier descending (GOLD first)', () => {
    const config: CourseSortConfig = { sortBy: 'Tier', sortOrder: -1 };
    const result = sortCourses([...courses], config);
    expect(result[0].Tier).toBe('GOLD');
    expect(result[1].Tier).toBe('SILVER');
    expect(result[2].Tier).toBe('BRONZE');
  });

  it('sorts by Duration ascending', () => {
    const config: CourseSortConfig = { sortBy: 'Duration', sortOrder: 1 };
    const result = sortCourses([...courses], config);
    expect(result[0].Duration).toBe(12);
    expect(result[1].Duration).toBe(24);
    expect(result[2].Duration).toBe(36);
  });
});
