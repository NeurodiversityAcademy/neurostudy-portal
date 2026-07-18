/**
 * Shared mock for next/image.
 * Usage: jest.mock('next/image', () => require('@/testUtils/mockNextImage'));
 */
import React from 'react';

const NEXT_IMAGE_ONLY_PROPS = [
  'fill',
  'priority',
  'quality',
  'placeholder',
  'blurDataURL',
  'loader',
  'unoptimized',
  'onLoadingComplete',
] as const;

type NextImageOnlyProp = (typeof NEXT_IMAGE_ONLY_PROPS)[number];

interface MockNextImageProps {
  alt?: string;
  src?: string | { src?: string } | null;
  [key: string]: unknown;
}

interface GetImagePropsArgs {
  src?: string | { src?: string };
  alt?: string;
  className?: string;
}

const resolveSrc = (src: MockNextImageProps['src']): string => {
  if (typeof src === 'object' && src !== null) {
    return src.src ?? '';
  }
  return String(src ?? '');
};

const omitNextOnlyProps = (props: MockNextImageProps): Record<string, unknown> => {
  const rest: Record<string, unknown> = { ...props };
  for (const key of NEXT_IMAGE_ONLY_PROPS) {
    delete rest[key as NextImageOnlyProp];
  }
  delete rest.src;
  delete rest.alt;
  return rest;
};

const MockNextImage = ({ alt = '', src, ...rest }: MockNextImageProps): React.ReactElement => {
  const imgProps = omitNextOnlyProps({ alt, src, ...rest });
  // Test stub — next/image is not available in Jest.
  // eslint-disable-next-line @next/next/no-img-element -- intentional Jest stub
  return <img alt={alt} src={resolveSrc(src)} {...imgProps} />;
};

export const getImageProps = ({
  src,
  alt,
  className,
}: GetImagePropsArgs): { props: Record<string, string | undefined> } => {
  const resolvedSrc = resolveSrc(src) || '/hero.webp';
  return {
    props: {
      src: resolvedSrc,
      srcSet: resolvedSrc,
      alt: alt ?? '',
      className,
    },
  };
};

export default MockNextImage;
