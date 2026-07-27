import { AU_STATE_ORDER, type AustralianState } from './emergingInstitutionTypes';

export const DESKTOP_STICKY_OFFSET_PX = 87;
export const MOBILE_STICKY_OFFSET_PX = 143;
export const MOBILE_BREAKPOINT_MEDIA_QUERY = '(max-width: 768px)';

export function stateSectionId(state: AustralianState): string {
  return `emerging-state-${state}`;
}

export function stateFromSectionElement(element: Element): AustralianState | null {
  const match = /^emerging-state-([A-Z]+)$/.exec(element.id);
  const state = match?.[1];
  if (state && (AU_STATE_ORDER as readonly string[]).includes(state)) {
    return state as AustralianState;
  }
  return null;
}

export function stickyNavOffsetPx(): number {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return DESKTOP_STICKY_OFFSET_PX;
  }
  return window.matchMedia(MOBILE_BREAKPOINT_MEDIA_QUERY).matches
    ? MOBILE_STICKY_OFFSET_PX
    : DESKTOP_STICKY_OFFSET_PX;
}

interface ScoredSection {
  state: AustralianState;
  top: number;
}

/** Prefer the section whose top is closest at or above the sticky offset line. */
export function selectActiveStateFromSections(
  sections: readonly HTMLElement[],
  stickyOffsetPx: number,
): AustralianState | null {
  const scored: ScoredSection[] = sections
    .map((element) => ({
      state: stateFromSectionElement(element),
      top: element.getBoundingClientRect().top,
    }))
    .filter((entry): entry is ScoredSection => entry.state !== null);

  if (scored.length === 0) {
    return null;
  }

  const atOrPastLine = scored.filter(({ top }) => top <= stickyOffsetPx + 1);
  if (atOrPastLine.length > 0) {
    return atOrPastLine.reduce((best, current) => (current.top > best.top ? current : best)).state;
  }

  return scored.reduce((best, current) => (current.top < best.top ? current : best)).state;
}
