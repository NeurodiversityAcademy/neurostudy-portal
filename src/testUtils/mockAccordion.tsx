/**
 * Shared mock for Accordion.
 * Usage:
 *   jest.mock('@/app/components/accordion/Accordian', () => require('@/testUtils/mockAccordion'));
 */
import React from 'react';

interface MockAccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

const MockAccordion = ({ title, children }: MockAccordionProps): React.ReactElement => (
  <div data-testid='accordion'>
    <div data-testid='accordion-title'>{title}</div>
    <div>{children}</div>
  </div>
);

export default MockAccordion;
