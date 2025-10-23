export const returnBadResponse = (
  info?: Record<string, unknown>,
  status?: number
): Response => {
  status = status || 400;

  return new Response(JSON.stringify({ error: 'Bad Request', ...info }), {
    status,
    statusText: 'Bad Request',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
};
