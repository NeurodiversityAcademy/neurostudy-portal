'use client';

import { useEffect, useRef } from 'react';
import { DATA_SECTION_ATTRIBUTE, SECTION_INTERSECTION_THRESHOLD } from '@/app/utilities/gaTracking';

type SectionVisibilityReporter = (section: string) => void;

function readSectionId(element: Element): string | null {
  const sectionId = element.getAttribute(DATA_SECTION_ATTRIBUTE);
  if (sectionId === null || sectionId.length === 0) {
    return null;
  }
  return sectionId;
}

function handleIntersectionEntries(
  entries: IntersectionObserverEntry[],
  seenSections: Set<string>,
  reportSectionVisible: SectionVisibilityReporter,
): void {
  for (const entry of entries) {
    if (!entry.isIntersecting) {
      continue;
    }
    const sectionId = readSectionId(entry.target);
    if (sectionId === null || seenSections.has(sectionId)) {
      continue;
    }
    seenSections.add(sectionId);
    reportSectionVisible(sectionId);
  }
}

export function useSectionVisibilityTracking(
  reportSectionVisible: SectionVisibilityReporter,
): void {
  const seenSections = useRef(new Set<string>());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => handleIntersectionEntries(entries, seenSections.current, reportSectionVisible),
      { threshold: SECTION_INTERSECTION_THRESHOLD },
    );

    const sections = document.querySelectorAll(`[${DATA_SECTION_ATTRIBUTE}]`);
    sections.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [reportSectionVisible]);
}
