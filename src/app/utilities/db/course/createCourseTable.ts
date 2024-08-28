import { CreateTableCommand } from '@aws-sdk/client-dynamodb';
import { dbDocumentClient } from '../configure';
import {
  COURSE_TABLE_INDEX_KEY_DEFINITIONS,
  COURSE_TABLE_NAME,
  COURSE_TABLE_PARTITION_KEY,
} from '../constants';
import { createDefaultGSI } from '../common';

export default async function createCourseTable() {
  return await dbDocumentClient.send(
    new CreateTableCommand({
      TableName: COURSE_TABLE_NAME,
      AttributeDefinitions: [
        { AttributeName: COURSE_TABLE_PARTITION_KEY, AttributeType: 'S' },
        ...COURSE_TABLE_INDEX_KEY_DEFINITIONS,
      ],
      KeySchema: [
        { AttributeName: COURSE_TABLE_PARTITION_KEY, KeyType: 'HASH' },
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
