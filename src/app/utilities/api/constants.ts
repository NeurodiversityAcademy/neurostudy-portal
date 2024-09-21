export const API_POINT_CONSUMPTION_LIMIT = 10;
export const API_CONSUMPTION_INTERVAL = 60; // In seconds

export const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];

export const DEFAULT_SERVER_ERROR_NAME = 'Request Failure';
export const DEFAULT_SERVER_ERROR_MESSAGE =
  'Server failed to handle the response.';
export const DEFAULT_SERVER_ERROR_RES = {
  name: DEFAULT_SERVER_ERROR_NAME,
  message: DEFAULT_SERVER_ERROR_MESSAGE,
};

export const RETURN_DEFAULT_ERROR_MESSAGE =
  process.env.NODE_ENV === 'production';
export const DEFAULT_ASSERTION_ERROR_MESSAGE = `Provided data doesn't satisfy type-check.`;
