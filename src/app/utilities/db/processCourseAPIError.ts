import { returnBadResponse } from '../responses';

export default function processCourseAPIError(ex: unknown): Response {
  const error = ex as Parameters<typeof returnBadResponse>[0];
  const status = parseInt((error?.status as string) || '0');
  delete error?.status;
  return returnBadResponse(error, status);
}
