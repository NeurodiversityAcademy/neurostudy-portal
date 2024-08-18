import {
  CreateTableCommand,
  GlobalSecondaryIndex,
} from '@aws-sdk/client-dynamodb';
import { dbDocumentClient } from '../configure';
import {
  COURSE_DETAILS_TABLE_INDEX_KEY_DEFINITIONS,
  COURSE_DETAILS_TABLE_NAME,
  COURSE_DETAILS_TABLE_PARTITION_KEY,
} from '../constants';
import { createDefaultGSI } from '../common';

export default async function createCourseDetailsTable() {
  let GlobalSecondaryIndexes: GlobalSecondaryIndex[] | undefined = undefined;
  if (COURSE_DETAILS_TABLE_INDEX_KEY_DEFINITIONS.length) {
    GlobalSecondaryIndexes = COURSE_DETAILS_TABLE_INDEX_KEY_DEFINITIONS.map(
      ({ AttributeName }) =>
        createDefaultGSI(AttributeName as string, {
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        })
    );
  }

  return await dbDocumentClient.send(
    new CreateTableCommand({
      TableName: COURSE_DETAILS_TABLE_NAME,
      AttributeDefinitions: [
        {
          AttributeName: COURSE_DETAILS_TABLE_PARTITION_KEY,
          AttributeType: 'S',
        },
        ...COURSE_DETAILS_TABLE_INDEX_KEY_DEFINITIONS,
      ],
      KeySchema: [
        { AttributeName: COURSE_DETAILS_TABLE_PARTITION_KEY, KeyType: 'HASH' },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      GlobalSecondaryIndexes,
    })
  );
}
