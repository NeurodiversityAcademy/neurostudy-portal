/**
 * @jest-environment node
 */
import throwAssertionError from '../api/throwAssertionError';
import processAPIError from '../api/processAPIError';
import { returnBadResponse } from '../responses';
import APIError from '@/app/interfaces/APIError';

jest.mock('../api/constants', () => ({
  RETURN_DEFAULT_ERROR_MESSAGE: false,
  DEFAULT_ASSERTION_ERROR_MESSAGE: "Provided data doesn't satisfy type-check.",
  DEFAULT_SERVER_ERROR_MESSAGE: 'Server failed to handle the response.',
  DEFAULT_SERVER_ERROR_NAME: 'Request Failure',
  DEFAULT_SERVER_ERROR_RES: {
    name: 'Request Failure',
    message: 'Server failed to handle the response.',
  },
}));

describe('throwAssertionError', () => {
  it('throws an error with status 400', () => {
    expect(() => throwAssertionError('Field is invalid')).toThrow();
  });

  it('throws an error whose message matches the provided string', () => {
    try {
      throwAssertionError('Custom error message');
    } catch (err) {
      expect((err as Error).message).toBe('Custom error message');
      expect((err as APIError).status).toBe(400);
    }
  });

  it('always sets status to 400', () => {
    try {
      throwAssertionError('Something went wrong');
    } catch (err) {
      expect((err as APIError).status).toBe(400);
    }
  });

  it('the thrown error has a status property', () => {
    try {
      throwAssertionError('test');
    } catch (err) {
      expect(err).toHaveProperty('status', 400);
      expect(err).toHaveProperty('message', 'test');
    }
  });
});

describe('processAPIError', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns a Response object', () => {
    const result = processAPIError(new Error('test'));
    expect(result).toBeInstanceOf(Response);
  });

  it('uses APIError status when no status argument is provided and instanceof resolves', async () => {
    const apiErr = new APIError({ error: 'Not found', status: 404 });
    const result = processAPIError(apiErr, 404);
    expect(result.status).toBe(404);
  });

  it('uses the provided status argument over default', async () => {
    const apiErr = new APIError({ error: 'Not found', status: 404 });
    const result = processAPIError(apiErr, 422);
    expect(result.status).toBe(422);
  });

  it('defaults to 500 when error is not APIError and no status', async () => {
    const result = processAPIError(new Error('generic error'));
    expect(result.status).toBe(500);
  });

  it('uses DEFAULT_SERVER_ERROR_RES for 5xx status with non-APIError', async () => {
    const result = processAPIError(new Error('oops'), 503);
    const body = await result.json();
    expect(body.name).toBe('Request Failure');
    expect(body.message).toBe('Server failed to handle the response.');
  });

  it('uses error name/message for non-5xx non-APIError', async () => {
    const err = new Error('Bad input');
    err.name = 'ValidationError';
    const result = processAPIError(err, 400);
    const body = await result.json();
    expect(body.name).toBe('ValidationError');
    expect(body.message).toBe('Bad input');
  });

  it('sets Content-Type header to application/json', () => {
    const result = processAPIError(new Error('test'));
    expect(result.headers.get('Content-Type')).toBe('application/json');
  });

  it('sets statusText from DEFAULT_SERVER_ERROR_NAME for generic errors', () => {
    const result = processAPIError(new Error('test'));
    expect(result.statusText).toBe('Request Failure');
  });

  it('handles null error with provided status', async () => {
    const result = processAPIError(null, 502);
    const body = await result.json();
    expect(result.status).toBe(502);
    expect(body.name).toBe('Request Failure');
    expect(body.message).toBe('Server failed to handle the response.');
  });

  it('handles null error without status (defaults to 500)', async () => {
    const result = processAPIError(null);
    expect(result.status).toBe(500);
    const body = await result.json();
    expect(body.name).toBe('Request Failure');
  });

  it('does not include status field in the response body', async () => {
    const apiErr = new APIError({ error: 'Oops', status: 400 });
    const result = processAPIError(apiErr);
    const body = await result.json();
    expect(body.status).toBeUndefined();
  });

  it('logs the error via console.error', () => {
    const err = new Error('logged');
    processAPIError(err);
    expect(console.error).toHaveBeenCalledWith('Common API Error', err);
  });
});

describe('returnBadResponse', () => {
  it('returns a Response with status 400 by default', () => {
    const result = returnBadResponse();
    expect(result.status).toBe(400);
  });

  it('includes "Bad Request" error in the body', async () => {
    const result = returnBadResponse();
    const body = await result.json();
    expect(body.error).toBe('Bad Request');
  });

  it('merges additional info into the response body', async () => {
    const result = returnBadResponse({ field: 'email', reason: 'invalid' });
    const body = await result.json();
    expect(body.error).toBe('Bad Request');
    expect(body.field).toBe('email');
    expect(body.reason).toBe('invalid');
  });

  it('allows custom status code', () => {
    const result = returnBadResponse(undefined, 422);
    expect(result.status).toBe(422);
  });

  it('sets statusText to "Bad Request"', () => {
    const result = returnBadResponse();
    expect(result.statusText).toBe('Bad Request');
  });

  it('sets Content-Type header to application/json', () => {
    const result = returnBadResponse();
    expect(result.headers.get('Content-Type')).toBe('application/json');
  });

  it('info can override the default error field', async () => {
    const result = returnBadResponse({ error: 'Custom Error' });
    const body = await result.json();
    expect(body.error).toBe('Custom Error');
  });
});

describe('isNextProductionBuildPhase', () => {
  const originalEnv = process.env.NEXT_PHASE;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.NEXT_PHASE;
    } else {
      process.env.NEXT_PHASE = originalEnv;
    }
    jest.resetModules();
  });

  it('returns true when NEXT_PHASE is "phase-production-build"', () => {
    process.env.NEXT_PHASE = 'phase-production-build';
    jest.resetModules();
    const { isNextProductionBuildPhase } = require('../nextBuildPhase');
    expect(isNextProductionBuildPhase).toBe(true);
  });

  it('returns false when NEXT_PHASE is undefined', () => {
    delete process.env.NEXT_PHASE;
    jest.resetModules();
    const { isNextProductionBuildPhase } = require('../nextBuildPhase');
    expect(isNextProductionBuildPhase).toBe(false);
  });

  it('returns false when NEXT_PHASE is a different value', () => {
    process.env.NEXT_PHASE = 'phase-development-server';
    jest.resetModules();
    const { isNextProductionBuildPhase } = require('../nextBuildPhase');
    expect(isNextProductionBuildPhase).toBe(false);
  });
});
