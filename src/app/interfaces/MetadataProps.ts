import { Metadata } from 'next';
import { META_TYPE } from '../utilities/constants';
import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';

export interface MetadataProps {
  params?: Record<string, string | string[]>;
  searchParams: Record<string, string | string[]>;
}

export type MetadataParams = Metadata & {
  canonical: string;
  type: META_TYPE | undefined;
  images: OpenGraph['images'];
};
