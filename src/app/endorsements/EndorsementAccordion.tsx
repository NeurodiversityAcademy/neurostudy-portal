'use client';

import { ReactNode } from 'react';
import Accordion from '../components/accordion/Accordian';
import { trackEndorsedProvidersFaqToggle } from './analytics';

type EndorsementAccordionProps = {
  title: string;
  children: ReactNode;
};

export default function EndorsementAccordion({
  title,
  children,
}: EndorsementAccordionProps) {
  return (
    <Accordion
      title={title}
      onToggle={(expanded) => trackEndorsedProvidersFaqToggle(title, expanded)}
    >
      {children}
    </Accordion>
  );
}
