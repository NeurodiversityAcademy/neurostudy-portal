import {
  CreateTableCommand,
  GlobalSecondaryIndex,
} from '@aws-sdk/client-dynamodb';
import { dbDocumentClient } from './configure';
import { COURSE_TABLE_NAME } from './constants';

const createDefaultGSI = (AttributeName: string): GlobalSecondaryIndex => {
  return {
    IndexName: 'GSI_' + AttributeName,
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
        { AttributeName: 'InstitutionName', AttributeType: 'S' },
        { AttributeName: 'Title', AttributeType: 'S' },
        { AttributeName: 'Area', AttributeType: 'S' },
        { AttributeName: 'Level', AttributeType: 'S' },
        { AttributeName: 'Rating', AttributeType: 'N' },
      ],
      KeySchema: [
        { AttributeName: 'InstitutionName', KeyType: 'HASH' },
        { AttributeName: 'Title', KeyType: 'RANGE' },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
      GlobalSecondaryIndexes: [
        createDefaultGSI('Title'),
        createDefaultGSI('Area'),
        createDefaultGSI('Level'),
        createDefaultGSI('Rating'),
      ],
    })
  );
}
