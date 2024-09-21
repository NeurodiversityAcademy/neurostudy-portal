import { GlobalSecondaryIndex } from '@aws-sdk/client-dynamodb';

export const getIndexName = (AttributeName: string) => 'GSI_' + AttributeName;

export const createDefaultGSI = (
  AttributeName: string,
  props?: Partial<GlobalSecondaryIndex>
): GlobalSecondaryIndex => {
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
    ...props,
  };
};
