import { GA_EVENTS } from '@/app/utilities/constants';
import { sendAccordionToggleEvent } from '@/app/utilities/gaTracking';

export const ACCORDION_NO_EXPAND_ACTION = (): void => {};

export function createAccordionExpandHandler(label: string): () => void {
  return () => {
    sendAccordionToggleEvent(
      GA_EVENTS.ACCORDION_TOGGLE.eventName,
      GA_EVENTS.ACCORDION_TOGGLE.category,
      label
    );
  };
}
