'use client';

import React, { useState } from 'react';
import tabStyles from '@/app/components/course/CourseDetails/courseDetails.module.css';
import Typography, { TypographyVariant } from '../typography/Typography';

export interface TabSectionTab {
  id: string;
  label: string;
}

export interface TabSectionProps {
  title: string;
  titleColor?: string;
  tabs: TabSectionTab[];
  disclaimer?: string | null;
  /** Extra class on outer `<section>` (e.g. provider page spacing) */
  sectionClassName?: string;
  children: (activeTabId: string) => React.ReactNode;
}

export default function TabSection({
  title,
  titleColor = 'var(--GhostWhiteVariant)',
  tabs,
  disclaimer,
  sectionClassName,
  children,
}: TabSectionProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? '');

  if (!tabs.length) {
    return null;
  }

  return (
    <section className={sectionClassName}>
      <div className={tabStyles.benefitTabContainer}>
        <Typography
          variant={TypographyVariant.H3}
          className={tabStyles.benefitTabContainerTitle}
          color={titleColor}
        >
          {title}
        </Typography>
        <div className={tabStyles.benefitTabTitleGroup} role='tablist'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type='button'
              role='tab'
              aria-selected={activeTab === tab.id}
              className={activeTab === tab.id ? tabStyles.activeTab : ''}
              onClick={() => setActiveTab(tab.id)}
            >
              <Typography
                variant={TypographyVariant.Body2Strong}
                className={tabStyles.benefitTabText}
              >
                {tab.label}
              </Typography>
            </button>
          ))}
        </div>
        {children(activeTab)}
        {disclaimer ? (
          <div className={tabStyles.adjustmentDisclaimer}>
            <Typography variant={TypographyVariant.Body3}>
              {disclaimer}
            </Typography>
          </div>
        ) : null}
      </div>
    </section>
  );
}
