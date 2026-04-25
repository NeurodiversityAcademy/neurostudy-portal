export type TabIconType = 'check' | 'close' | 'none';

/** Course benefits tabs: body comes from CourseDetails context, not JSON items. */
export type CourseBenefitsContentSource = 'support' | 'adjustment' | 'jobs';

export interface CourseBenefitsTabDefinition {
  id: string;
  label: string;
  courseSource: CourseBenefitsContentSource;
}

export interface CourseBenefitsTabSectionConfig {
  title: string;
  tabs: CourseBenefitsTabDefinition[];
  /** Optional footnote under tab content */
  disclaimer?: string | null;
}

export interface InstituteTabSectionTab {
  id: string;
  label: string;
  iconType: TabIconType;
  items: string[];
}

export interface InstituteTabSectionConfig {
  title: string;
  tabs: InstituteTabSectionTab[];
  disclaimer?: string | null;
}

export interface EmergingInstituteTabSectionsFile {
  studentSuitabilityDefault: InstituteTabSectionConfig;
  /** Per-slug overrides; when missing, `studentSuitabilityDefault` is used */
  byInstituteSlug?: Record<
    string,
    { studentSuitability?: InstituteTabSectionConfig }
  >;
}
