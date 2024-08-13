import {
  CreateTableCommand,
  GlobalSecondaryIndex,
} from '@aws-sdk/client-dynamodb';
import { dbDocumentClient } from './configure';
import {
  COURSE_TABLE_INDEX_KEY_DEFINITIONS,
  COURSE_TABLE_NAME,
  COURSE_TABLE_PARTITION_KEY,
  COURSE_TABLE_SORT_KEY,
} from './constants';
import { getIndexName } from './common';

const createDefaultGSI = (AttributeName: string): GlobalSecondaryIndex => {
  return {
    IndexName: getIndexName(AttributeName),
    KeySchema: [{ AttributeName, KeyType: 'HASH' }],
    Projection: {
      ProjectionType: 'ALL',
    },
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };
};

export default async function createCourseTable() {
  return await dbDocumentClient.send(
    new CreateTableCommand({
      TableName: COURSE_TABLE_NAME,
      AttributeDefinitions: [
        { AttributeName: COURSE_TABLE_PARTITION_KEY, AttributeType: 'S' },
        { AttributeName: COURSE_TABLE_SORT_KEY, AttributeType: 'S' },
        ...COURSE_TABLE_INDEX_KEY_DEFINITIONS.filter(
          ({ AttributeName }) => AttributeName !== COURSE_TABLE_SORT_KEY
        ),
      ],
      KeySchema: [
        { AttributeName: COURSE_TABLE_PARTITION_KEY, KeyType: 'HASH' },
        { AttributeName: COURSE_TABLE_SORT_KEY, KeyType: 'RANGE' },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
      GlobalSecondaryIndexes: COURSE_TABLE_INDEX_KEY_DEFINITIONS.map(
        ({ AttributeName }) => createDefaultGSI(AttributeName as string)
      ),
    })
  );
}
