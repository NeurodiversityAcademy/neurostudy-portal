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
 */
const ATTEMPT_KEY = 'nda-botid-verify-attempts';
const MAX_ATTEMPTS = 2;

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

    void (async () => {
      const attempts = Number(window.sessionStorage.getItem(ATTEMPT_KEY) ?? '0');

      if (attempts >= MAX_ATTEMPTS) {
        if (active) {
          setFailed(true);
        }
        return;
      }

      window.sessionStorage.setItem(ATTEMPT_KEY, String(attempts + 1));

      try {
        const response = await fetch('/api/verify', {
          method: 'POST',
          credentials: 'same-origin',
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('verification failed');
        }

        if (!active) {
          return;
        }

        window.sessionStorage.removeItem(ATTEMPT_KEY);
        router.refresh();
      } catch {
        if (active) {
          setFailed(true);
        }
      }
    })();

    return () => {
      active = false;
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
