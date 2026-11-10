export type CompareQiltStat = {
  title: string;
  value: string;
  nationalAverage: string;
  responses: string;
};

export type CompareProviderPayload = {
  slug: string;
  name: string;
  tier: 'course_endorsed' | 'endorsed' | 'emerging';
  type: string;
  locations: string[];
  ndaCertified: boolean;
  supportInPlace: number | null;
  supportInWorks: number | null;
  supportSections: Array<{
    title: string;
    items: Array<{ label: string; status: string }>;
  }>;
  qilt: {
    points: number;
    dims: number;
    responses: number;
    stats: CompareQiltStat[];
  } | null;
  detailHref: string;
};

export type ShortlistSuccess = {
  ok: true;
  verification: 'pending' | 'pending_email_unconfigured';
  unlockedUntil: string;
  slugs: string[];
};

export type ShortlistFailure = {
  ok: false;
  reason: string;
};

export type CompareSuccess = {
  ok: true;
  providers: CompareProviderPayload[];
};

export type CompareFailure = {
  ok: false;
  reason: string;
};
