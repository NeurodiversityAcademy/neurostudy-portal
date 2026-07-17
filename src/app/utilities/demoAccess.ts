import {
  isKnownEndorsedSlug,
  isLiveEndorsedSlug,
} from '@/app/components/endorsedProviders/endorsedProviderPageData';
import type { SearchParams } from '@/app/utilities/featureToggle';
import { readFirstSearchParamValue } from '@/app/utilities/searchParamsReader';

export const DEMO_PASS_PARAM = 'demo' as const;
export const ENDORSED_DEMO_ACCESS_ENV_KEY = 'ENDORSED_DEMO_ACCESS' as const;
export const ENDORSED_PROVIDERS_BASE_PATH = '/endorsedproviders' as const;

export type DemoAccessMap = Record<string, string>;

export type DetailDemoAccess = {
  internalSlug: string;
};

let demoAccessMapCache: DemoAccessMap | null = null;

export function resetDemoAccessMapCacheForTests(): void {
  demoAccessMapCache = null;
}

function parseDemoAccessMapFromEnv(): DemoAccessMap {
  const raw = process.env[ENDORSED_DEMO_ACCESS_ENV_KEY];
  if (typeof raw !== 'string' || raw === '') {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }

    const result: DemoAccessMap = {};
    const entries = Object.entries(parsed as Record<string, unknown>);
    for (let i = 0; i < entries.length; i += 1) {
      const entry = entries[i];
      const key = entry[0];
      const value = entry[1];
      if (typeof value === 'string') {
        result[key] = value;
      }
    }
    return result;
  } catch {
    return {};
  }
}

function getDemoAccessMap(): DemoAccessMap {
  if (demoAccessMapCache !== null) {
    return demoAccessMapCache;
  }
  demoAccessMapCache = parseDemoAccessMapFromEnv();
  return demoAccessMapCache;
}

export function parseDemoAccessMap(): DemoAccessMap {
  return getDemoAccessMap();
}

export function isValidDemoGuid(guid: string): boolean {
  const map = getDemoAccessMap();
  return Object.prototype.hasOwnProperty.call(map, guid);
}

export function resolveGuidToSlug(guid: string): string | null {
  const map = getDemoAccessMap();
  if (!Object.prototype.hasOwnProperty.call(map, guid)) {
    return null;
  }
  return map[guid];
}

export function readDemoGuidFromSearchParams(searchParams: SearchParams): string | null {
  return readFirstSearchParamValue(searchParams, DEMO_PASS_PARAM);
}

export function buildEndorsedDemoDetailHref(guid: string): string {
  if (guid === '') {
    return '';
  }

  const params = new URLSearchParams();
  params.set(DEMO_PASS_PARAM, guid);
  return `${ENDORSED_PROVIDERS_BASE_PATH}/${guid}?${params.toString()}`;
}

export function buildEndorsedDemoHomeHref(guid: string): string {
  if (guid === '') {
    return '';
  }

  const params = new URLSearchParams();
  params.set(DEMO_PASS_PARAM, guid);
  return `/?${params.toString()}`;
}

export function buildEndorsedLiveDetailHref(slug: string): string {
  if (slug === '') {
    return '';
  }

  return `${ENDORSED_PROVIDERS_BASE_PATH}/${slug}`;
}

export type HomeDemoAccess = {
  demoGuid: string;
  demoSlug: string;
};

export function resolveHomeDemoAccess(searchParams: SearchParams): HomeDemoAccess | null {
  const demoGuid = readDemoGuidFromSearchParams(searchParams);
  if (demoGuid === null) {
    return null;
  }

  const demoSlug = resolveGuidToSlug(demoGuid);
  if (demoSlug === null) {
    return null;
  }

  return { demoGuid, demoSlug };
}

function isBlockedPublicSlugPath(pathGuid: string): boolean {
  return isKnownEndorsedSlug(pathGuid);
}

function passesGuidMatch(pathGuid: string, demoGuid: string): boolean {
  return pathGuid === demoGuid;
}

function resolveInternalSlugFromDemoGuid(demoGuid: string): string | null {
  return resolveGuidToSlug(demoGuid);
}

export function resolveDetailDemoAccess(
  pathGuid: string,
  searchParams: SearchParams,
): DetailDemoAccess | null {
  if (pathGuid === '') {
    return null;
  }

  if (isLiveEndorsedSlug(pathGuid)) {
    return { internalSlug: pathGuid };
  }

  if (isBlockedPublicSlugPath(pathGuid)) {
    return null;
  }

  const demoGuid = readDemoGuidFromSearchParams(searchParams);
  if (demoGuid === null) {
    return null;
  }

  if (!passesGuidMatch(pathGuid, demoGuid)) {
    return null;
  }

  const internalSlug = resolveInternalSlugFromDemoGuid(demoGuid);
  if (internalSlug === null) {
    return null;
  }

  return { internalSlug };
}
