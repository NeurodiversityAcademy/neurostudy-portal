'use client';

import { MouseEventHandler, ReactNode, useId, useState } from 'react';
import styles from './accordion.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';
import ArrowDownIcon from '@/app/components/images/ArrowDown';
import classNames from 'classnames';

interface Props {
  title: string;
  children: ReactNode;
  startExpanded?: boolean;
}

const Accordion: React.FC<Props> = ({
  title,
  children,
  startExpanded = false,
}) => {
  const contentId = useId() + '-accordion-content';
  const [expanded, setExpanded] = useState(startExpanded);

  const toggleContent: MouseEventHandler = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      className={classNames(styles.container, !expanded && styles.collapsed)}
    >
      <div
        className={styles.header}
        aria-expanded={expanded}
        aria-controls={contentId}
        role='button'
        onClick={toggleContent}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleContent(e as never);
          }
        }}
      >
        <Typography variant={TypographyVariant.Body2} className={styles.title}>
          {title}
        </Typography>
        <button
          aria-expanded={expanded}
          aria-controls={contentId}
          className={styles.collapsibleIcon}
          tabIndex={-1}
        >
          <ArrowDownIcon />
        </button>
      </div>
      <div className={styles.content} id={contentId} aria-hidden={!expanded}>
        <div className={styles.contentPadding}>{children}</div>
      </div>
    </div>
  );
};

export default Accordion;
