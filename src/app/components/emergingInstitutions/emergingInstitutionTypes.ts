export type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'SA' | 'WA' | 'TAS' | 'NT' | 'ACT';

export type EmergingInstitution = {
  name: string;
  state: AustralianState;
  /** Demo listings have no detail page yet — shown in teaser/directory only. */
  demo?: boolean;
};

/** Neutral geographic order — not a popularity rank. */
export const AU_STATE_ORDER: readonly AustralianState[] = [
  'NSW',
  'VIC',
  'QLD',
  'SA',
  'WA',
  'TAS',
  'NT',
  'ACT',
];

/** Display labels for Australian states and territories. */
export const AU_STATE_LABELS: Record<AustralianState, string> = {
  NSW: 'New South Wales',
  VIC: 'Victoria',
  QLD: 'Queensland',
  SA: 'South Australia',
  WA: 'Western Australia',
  TAS: 'Tasmania',
  NT: 'Northern Territory',
  ACT: 'Australian Capital Territory',
};

export type EmergingInstitutionsByState = {
  state: AustralianState;
  institutions: EmergingInstitution[];
};

export function groupEmergingInstitutionsByState(
  institutions: readonly EmergingInstitution[],
): EmergingInstitutionsByState[] {
  const byState = new Map<AustralianState, EmergingInstitution[]>();

  for (const institution of institutions) {
    const existing = byState.get(institution.state) ?? [];
    existing.push(institution);
    byState.set(institution.state, existing);
  }

  return AU_STATE_ORDER.filter((state) => byState.has(state)).map((state) => ({
    state,
    institutions: byState.get(state) ?? [],
  }));
}

export function countDistinctStates(institutions: readonly EmergingInstitution[]): number {
  return new Set(institutions.map((institution) => institution.state)).size;
}
