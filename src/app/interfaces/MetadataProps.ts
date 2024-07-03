import { META_TYPE } from '../utilities/constants';

export interface MetadataProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export interface MetadataParams {
  title?: string;
  keywords?: string;
  description?: string;
  canonical?: string;
  type?: META_TYPE;
  images?:
    | {
        url: string;
      }[]
    | [];
}
