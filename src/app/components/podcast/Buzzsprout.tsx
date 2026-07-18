'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './podcast.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';
import PodcastUnavailableMessage from './PodcastUnavailableMessage';

export interface BuzzsproutEmbedProps {
  scriptSrc: string;
  containerId: string;
  singleBlog: boolean;
  embedAvailable?: boolean;
}

const PLAYER_LOAD_TIMEOUT_MS = 8000;
const MIN_PLAYER_HEIGHT_PX = 50;

function buildBuzzsproutScriptId(containerId: string): string {
  return `${containerId}-embed-script`;
}

function isPlayerRendered(containerId: string): boolean {
  const container = document.getElementById(containerId);
  if (container === null) {
    return false;
  }

  const iframe = container.querySelector('iframe');
  if (iframe !== null && iframe.offsetHeight >= MIN_PLAYER_HEIGHT_PX) {
    return true;
  }

  return container.childElementCount > 0 && container.offsetHeight >= MIN_PLAYER_HEIGHT_PX;
}

const BuzzsproutEmbed: React.FC<BuzzsproutEmbedProps> = ({
  scriptSrc,
  containerId,
  singleBlog,
  embedAvailable = true,
}) => {
  const [showFallback, setShowFallback] = useState(!embedAvailable);
  const [shouldLoadPlayer, setShouldLoadPlayer] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!embedAvailable || shouldLoadPlayer) {
      return;
    }

    const target = sectionRef.current;
    if (target === null) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setShouldLoadPlayer(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadPlayer(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [embedAvailable, shouldLoadPlayer]);

  useEffect(() => {
    if (!embedAvailable || !shouldLoadPlayer) {
      return;
    }

    const container = document.getElementById(containerId);
    if (container === null) {
      return;
    }

    const scriptId = buildBuzzsproutScriptId(containerId);
    const existingScript = document.getElementById(scriptId);
    if (existingScript !== null) {
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = scriptSrc;
    script.async = true;
    document.body.appendChild(script);

    const timeoutId = window.setTimeout(() => {
      if (!isPlayerRendered(containerId)) {
        setShowFallback(true);
      }
    }, PLAYER_LOAD_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timeoutId);
      script.remove();
      container.innerHTML = '';
    };
  }, [scriptSrc, containerId, embedAvailable, shouldLoadPlayer]);

  if (showFallback) {
    return <PodcastUnavailableMessage singleBlog={singleBlog} />;
  }

  return (
    <div className={styles.podcastContainer} ref={sectionRef}>
      <div className={styles.podcastHeader}>
        <Typography variant={TypographyVariant.H2}>
          {singleBlog ? 'Listen to our Podcast' : 'Explore more of our Podcast'}
        </Typography>
      </div>
      <div id={containerId} className={styles.playerHost} />
    </div>
  );
};

export default BuzzsproutEmbed;
