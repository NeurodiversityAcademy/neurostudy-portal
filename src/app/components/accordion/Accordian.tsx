'use client';

import { ReactNode, useId, useState } from 'react';
import styles from './accordion.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';
import ArrowDownIcon from '@/app/components/images/ArrowDown';
import classNames from 'classnames';

interface Props {
  title: string | ReactNode;
  children: ReactNode;
  startExpanded?: boolean;
  className?: string;
}

const Accordion: React.FC<Props> = ({
  title,
  children,
  startExpanded = false,
  className,
}) => {
  const contentId = useId() + '-accordion-content';
  const triggerId = useId() + '-accordion-trigger';
  const [expanded, setExpanded] = useState(startExpanded);

  const toggleContent = () => {
    setExpanded((previous) => !previous);
  };

  return (
    <div
      className={classNames(
        styles.container,
        !expanded && styles.collapsed,
        className
      )}
    >
      <button
        type='button'
        className={styles.header}
        id={triggerId}
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={toggleContent}
      >
        <Typography variant={TypographyVariant.Body2} className={styles.title}>
          {title}
        </Typography>
        <span className={styles.collapsibleIcon} aria-hidden='true'>
          <ArrowDownIcon />
        </span>
      </button>
      <div
        className={styles.content}
        id={contentId}
        aria-hidden={!expanded}
        aria-labelledby={triggerId}
      >
        <div className={styles.contentPadding}>{children}</div>
      </div>
    </div>
  );
};

export default Accordion;
