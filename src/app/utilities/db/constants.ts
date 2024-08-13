import { AttributeDefinition } from '@aws-sdk/client-dynamodb';

export const COURSE_TABLE_NAME = process.env.COURSE_TABLE_NAME || 'NDACourses';
export const COURSE_TABLE_PARTITION_KEY = 'InstitutionName';
export const COURSE_TABLE_SORT_KEY = 'Title';
export const COURSE_TABLE_INDEX_KEY_DEFINITIONS: AttributeDefinition[] = [
  { AttributeName: COURSE_TABLE_SORT_KEY, AttributeType: 'S' },
  { AttributeName: 'InterestArea', AttributeType: 'S' },
  { AttributeName: 'Level', AttributeType: 'S' },
  { AttributeName: 'Rating', AttributeType: 'N' },
];
