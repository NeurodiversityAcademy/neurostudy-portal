import { AuthError } from 'aws-amplify/auth';
import { returnBadResponse } from '../responses';
import { DynamoDBServiceException } from '@aws-sdk/client-dynamodb';
import processAPIError from '../api/processAPIError';
import { returnDBError } from '../db/responses';

export const returnAuthError = (ex: Error | unknown) => {
  if (ex instanceof AuthError) {
    return returnBadResponse({ name: ex.name, message: ex.message });
  } else if (ex instanceof DynamoDBServiceException) {
    return returnDBError(ex);
  } else {
    return processAPIError(ex instanceof Error ? ex : null);
  }
};
