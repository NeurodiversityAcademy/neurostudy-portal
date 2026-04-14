import raw from './emergingInstituteTabSections.json';
import type {
  EmergingInstituteTabSectionsFile,
  InstituteTabSectionConfig,
} from './tabSectionTypes';

const data = raw as EmergingInstituteTabSectionsFile;

export function getStudentSuitabilitySection(
  instituteSlug: string
): InstituteTabSectionConfig {
  const override = data.byInstituteSlug?.[instituteSlug]?.studentSuitability;
  return override ?? data.studentSuitabilityDefault;
}
