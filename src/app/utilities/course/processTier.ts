export const processTier = (Tier?: string): string | undefined => {
  if (!Tier) {
    return;
  }

  Tier = Tier.toLowerCase();

  switch (Tier) {
    case 'gold':
      return 'GOLD';
    case 'silver':
      return 'SILVER';
    case 'bronze':
      return 'BRONZE';
    default:
      return;
  }
};
