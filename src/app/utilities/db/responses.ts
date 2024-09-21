import { DynamoDBServiceException } from '@aws-sdk/client-dynamodb';
import processAPIError from '../api/processAPIError';
import { DEFAULT_SERVER_ERROR_RES } from '../api/constants';

export const returnDBError = (ex: DynamoDBServiceException) => {
  const status: number | undefined = ex.$metadata.httpStatusCode;
  return processAPIError(
    status === 400 ? DEFAULT_SERVER_ERROR_RES : ex,
    status
  );
};
