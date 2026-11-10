'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/search/search.module.css';

/**
 * Requests the BotID verification cookie, then refreshes the server component
 * so it can render provider results.
 *
 * The attempt counter prevents a refresh loop when the cookie cannot be set
 * (for example, a browser that blocks cookies).
 *
 * Failures are logged in detail under the `[search-verify]` prefix: the gate
 * hides every result until this succeeds, so the console is the only place the
 * cause is visible from the browser.
 */
const ATTEMPT_KEY = 'nda-botid-verify-attempts';
const MAX_ATTEMPTS = 2;
const LOG_PREFIX = '[search-verify]';
const MAX_LOGGED_BODY = 500;

function stringifyError(error: unknown): unknown {
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack };
  }
  return error;
}

async function readResponseBody(response: Response): Promise<string> {
  if (typeof response.text !== 'function') {
    return '<no body>';
  }
  try {
    return (await response.text()).slice(0, MAX_LOGGED_BODY);
  } catch {
    return '<unreadable body>';
  }
}

export default function SearchVerification() {
  const router = useRouter();
  const started = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (started.current) {
      return;
    }
    started.current = true;

    let active = true;

    /**
     * The bot-protection challenge script is minified vendor code, so its
     * errors arrive with no app stack trace. Record the source file and
     * position to identify the script that failed.
     */
    const onWindowError = (event: ErrorEvent) => {
      console.error(`${LOG_PREFIX} script error during verification`, {
        message: event.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        error: stringifyError(event.error),
      });
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error(`${LOG_PREFIX} unhandled rejection during verification`, {
        reason: stringifyError(event.reason),
      });
    };

    window.addEventListener('error', onWindowError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);

    void (async () => {
      const attempts = Number(window.sessionStorage.getItem(ATTEMPT_KEY) ?? '0');

      if (attempts >= MAX_ATTEMPTS) {
        console.error(`${LOG_PREFIX} giving up: retry budget exhausted`, {
          attempts,
          maxAttempts: MAX_ATTEMPTS,
          hint: 'No verification cookie was issued; check the earlier [search-verify] entries.',
        });
        if (active) {
          setFailed(true);
        }
        return;
      }

      window.sessionStorage.setItem(ATTEMPT_KEY, String(attempts + 1));

      console.info(`${LOG_PREFIX} requesting verification`, { attempt: attempts + 1 });

      try {
        const response = await fetch('/api/verify', {
          method: 'POST',
          credentials: 'same-origin',
          cache: 'no-store',
        });

        if (!response.ok) {
          console.error(`${LOG_PREFIX} verification rejected by /api/verify`, {
            status: response.status,
            statusText: response.statusText,
            attempt: attempts + 1,
            body: await readResponseBody(response),
            hint: '403: BotID classified this browser as a bot. 429: rate limited.',
          });
          throw new Error(`verification failed with status ${response.status}`);
        }

        if (!active) {
          return;
        }

        window.sessionStorage.removeItem(ATTEMPT_KEY);
        console.info(`${LOG_PREFIX} verified, refreshing results`);
        router.refresh();
      } catch (error) {
        console.error(`${LOG_PREFIX} verification attempt failed`, {
          attempt: attempts + 1,
          error: stringifyError(error),
        });
        if (active) {
          setFailed(true);
        }
      }
    })();

    return () => {
      active = false;
      window.removeEventListener('error', onWindowError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, [router]);

  const retry = () => {
    window.sessionStorage.removeItem(ATTEMPT_KEY);
    window.location.reload();
  };

  return (
    <div className={styles.verification} role='status' aria-live='polite'>
      {failed ? (
        <>
          <p className={styles.verificationText}>
            Search is available to people using this site. If you are using a private or
            script-blocking browser, allow scripts for this page and try again.
          </p>
          <button type='button' className={styles.verificationButton} onClick={retry}>
            Try again
          </button>
        </>
      ) : (
        <p className={styles.verificationText}>Checking your browser…</p>
      )}
    </div>
  );
}
