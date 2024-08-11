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
