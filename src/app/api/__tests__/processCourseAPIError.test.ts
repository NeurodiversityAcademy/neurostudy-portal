/**
 * @jest-environment node
 */
import { DynamoDBServiceException } from '@aws-sdk/client-dynamodb';
import processCourseAPIError from '@/app/utilities/db/processCourseAPIError';

jest.mock('@/app/utilities/db/responses', () => ({
  returnDBError: jest.fn().mockImplementation((ex: DynamoDBServiceException) => {
    return new Response(JSON.stringify({ message: ex.message }), {
      status: ex.$metadata.httpStatusCode || 500,
    });
  }),
}));

jest.mock('@/app/utilities/api/processAPIError', () =>
  jest.fn().mockImplementation((err: Error | null, status?: number) => {
    return new Response(JSON.stringify({ message: err?.message || 'Server error' }), {
      status: status || 500,
    });
  }),
);

import { returnDBError } from '@/app/utilities/db/responses';
import processAPIError from '@/app/utilities/api/processAPIError';

const mockReturnDBError = returnDBError as jest.Mock;
const mockProcessAPIError = processAPIError as jest.Mock;

describe('processCourseAPIError', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('delegates to returnDBError for DynamoDB exceptions', () => {
    const dbError = new DynamoDBServiceException({
      name: 'ResourceNotFoundException',
      $fault: 'client',
      $metadata: { httpStatusCode: 400 },
      message: 'Table not found',
    });

    processCourseAPIError(dbError);

    expect(mockReturnDBError).toHaveBeenCalledWith(dbError);
    expect(mockProcessAPIError).not.toHaveBeenCalled();
  });

  it('delegates to processAPIError for non-DynamoDB errors', () => {
    const error = new Error('Something went wrong');

    processCourseAPIError(error);

    expect(mockProcessAPIError).toHaveBeenCalledWith(error);
    expect(mockReturnDBError).not.toHaveBeenCalled();
  });

  it('handles null errors by passing to processAPIError', () => {
    processCourseAPIError(null);

    expect(mockProcessAPIError).toHaveBeenCalledWith(null);
  });

  it('returns a Response from returnDBError for DB exceptions', () => {
    const dbError = new DynamoDBServiceException({
      name: 'ValidationException',
      $fault: 'client',
      $metadata: { httpStatusCode: 400 },
      message: 'Validation error',
    });

    mockReturnDBError.mockReturnValue(
      new Response(JSON.stringify({ message: 'Validation error' }), {
        status: 400,
      }),
    );

    const result = processCourseAPIError(dbError);

    expect(result).toBeInstanceOf(Response);
    expect(result.status).toBe(400);
  });
});
