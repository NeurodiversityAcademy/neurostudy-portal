import EmergingProviderStats from './EmergingProviderStats';
import type { ProviderStatItem } from './EmergingProviderStats';

export type { ProviderStatItem };

type InstitutionStatsProps = {
  stats: ProviderStatItem[];
  /** When true, omit horizontal section padding (parent already matches delivery-signals column). */
  isAlignedWithPageColumn?: boolean;
  sourceHref?: string;
};

export default function InstitutionStats({
  stats,
  isAlignedWithPageColumn = false,
  sourceHref,
}: InstitutionStatsProps) {
  return (
    <EmergingProviderStats
      stats={stats}
      isAlignedWithPageColumn={isAlignedWithPageColumn}
      sourceHref={sourceHref}
    />
  );
}
