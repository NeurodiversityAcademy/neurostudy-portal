import { DynamoDBServiceException } from '@aws-sdk/client-dynamodb';
import { returnDBError } from './responses';
import processAPIError from '../api/processAPIError';

export default function processCourseAPIError(ex: unknown): Response {
  if (ex instanceof DynamoDBServiceException) {
    console.error(ex);
    return returnDBError(ex);
  }

  return processAPIError(ex as Parameters<typeof processAPIError>[0]);
}
