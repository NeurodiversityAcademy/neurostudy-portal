import { initBotId } from 'botid/client/core';

/**
 * Routes that must carry BotID signals.
 *
 * Content pages are intentionally absent: AI crawlers and assistants should be
 * able to read them. Only the search verification and ask endpoints are gated.
 */
initBotId({
  protect: [
    { path: '/api/verify', method: 'POST' },
    { path: '/api/search/assist', method: 'POST' },
  ],
});
