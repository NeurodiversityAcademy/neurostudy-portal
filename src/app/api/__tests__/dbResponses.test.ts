/**
 * @jest-environment node
 */
import { DynamoDBServiceException } from '@aws-sdk/client-dynamodb';

jest.mock('@/app/utilities/api/processAPIError', () =>
  jest.fn().mockImplementation((err: unknown, status?: number) => {
    const s = status || 500;
    return new Response(
      JSON.stringify({
        message: (err as Error)?.message || 'Server error',
      }),
      { status: s },
    );
  }),
);

jest.mock('@/app/utilities/api/constants', () => ({
  DEFAULT_SERVER_ERROR_RES: {
    name: 'Request Failure',
    message: 'Server failed to handle the response.',
  },
}));

import { returnDBError } from '@/app/utilities/db/responses';
import processAPIError from '@/app/utilities/api/processAPIError';

const mockProcessAPIError = processAPIError as jest.Mock;

describe('returnDBError', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logs the DB error', () => {
    const dbError = new DynamoDBServiceException({
      name: 'InternalServerError',
      $fault: 'server',
      $metadata: { httpStatusCode: 500 },
      message: 'Internal error',
    });

    returnDBError(dbError);

    expect(console.error).toHaveBeenCalledWith('DB Error', dbError);
  });

  it('passes DEFAULT_SERVER_ERROR_RES for 400 status', () => {
    const dbError = new DynamoDBServiceException({
      name: 'ValidationException',
      $fault: 'client',
      $metadata: { httpStatusCode: 400 },
      message: 'Validation error',
    });

    returnDBError(dbError);

    expect(mockProcessAPIError).toHaveBeenCalledWith(
      {
        name: 'Request Failure',
        message: 'Server failed to handle the response.',
      },
      400,
    );
  });

  it('passes the exception itself for non-400 status', () => {
    const dbError = new DynamoDBServiceException({
      name: 'ResourceNotFoundException',
      $fault: 'client',
      $metadata: { httpStatusCode: 404 },
      message: 'Table not found',
    });

    returnDBError(dbError);

    expect(mockProcessAPIError).toHaveBeenCalledWith(dbError, 404);
  });

  it('returns a Response object', () => {
    const dbError = new DynamoDBServiceException({
      name: 'InternalServerError',
      $fault: 'server',
      $metadata: { httpStatusCode: 500 },
      message: 'Internal error',
    });

    const result = returnDBError(dbError);

    expect(result).toBeInstanceOf(Response);
  });
});
