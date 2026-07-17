/**
 * @jest-environment node
 */
jest.mock('@/app/utilities/api/processAPIError', () =>
  jest.fn(() => new Response(JSON.stringify({ error: 'Server Error' }), { status: 500 }))
);
jest.mock('@/app/utilities/db/responses', () => ({
  returnDBError: jest.fn(
    () => new Response(JSON.stringify({ error: 'DB Error' }), { status: 500 })
  ),
}));

import { returnAuthError } from '@/app/utilities/auth/responses';
import { AuthError } from 'aws-amplify/auth';
import { DynamoDBServiceException } from '@aws-sdk/client-dynamodb';
import processAPIError from '@/app/utilities/api/processAPIError';
import { returnDBError } from '@/app/utilities/db/responses';

describe('returnAuthError', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns bad response for AuthError', async () => {
    const authErr = new AuthError({
      name: 'UserNotFoundException',
      message: 'User does not exist',
    });

    const response = returnAuthError(authErr);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Bad Request');
  });

  it('calls returnDBError for DynamoDBServiceException', () => {
    const dbErr = new DynamoDBServiceException({
      name: 'ConditionalCheckFailedException',
      message: 'Condition not met',
      $fault: 'client',
      $metadata: { httpStatusCode: 400 },
    });

    returnAuthError(dbErr);

    expect(returnDBError).toHaveBeenCalledWith(dbErr);
  });

  it('calls processAPIError for generic Error', () => {
    const genericErr = new Error('Something went wrong');

    returnAuthError(genericErr);

    expect(processAPIError).toHaveBeenCalledWith(genericErr);
  });

  it('calls processAPIError with null for non-Error values', () => {
    returnAuthError('random string');

    expect(processAPIError).toHaveBeenCalledWith(null);
  });
});
