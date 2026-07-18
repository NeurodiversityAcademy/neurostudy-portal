import { HOST_URL } from '@/app/utilities/constants';

/** Canonical production origin; mirrors root layout `metadataBase` localhost handling. */
export function getSiteOrigin(): string {
  return HOST_URL.includes('localhost') ? 'https://neurodiversityacademy.com' : HOST_URL;
}
