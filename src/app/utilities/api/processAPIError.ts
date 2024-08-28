import APIError from '@/app/interfaces/APIError';
import {
  DEFAULT_SERVER_ERROR_MESSAGE,
  DEFAULT_SERVER_ERROR_NAME,
  DEFAULT_SERVER_ERROR_RES,
} from './constants';

export default function processAPIError(
  error: Error | null,
  status?: number
): Response {
  if (!status) {
    status = (error instanceof APIError && error.status) || 500;
  }

  const res =
    (error instanceof APIError && error) ||
    (status.toString().startsWith('5') && DEFAULT_SERVER_ERROR_RES) ||
    (error && {
      name: error.name || DEFAULT_SERVER_ERROR_NAME,
      message: error.message || DEFAULT_SERVER_ERROR_MESSAGE,
    }) ||
    null;

  const statusText = res?.name || DEFAULT_SERVER_ERROR_NAME;

  return new Response(JSON.stringify({ ...res, status: undefined }), {
    status,
    statusText,
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
}
