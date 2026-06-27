import InstitutionHero, {
  InstitutionHeroVariant,
  type HeroInfoItem,
} from './InstitutionHero';

export type { HeroInfoItem };

type EmergingProviderHeroProps = {
  title: string;
  heroInfoItems: HeroInfoItem[];
};

export default function EmergingProviderHero({
  title,
  heroInfoItems,
}: EmergingProviderHeroProps) {
  return (
    <InstitutionHero
      variant={InstitutionHeroVariant.Emerging}
      title={title}
      heroInfoItems={heroInfoItems}
    />
  );
}
