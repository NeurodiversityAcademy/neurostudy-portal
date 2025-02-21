import { ReactElement, useId } from 'react';

interface PropType extends React.SVGProps<SVGSVGElement> {
  percentage?: number;
}

export default function StarPercentage({
  percentage = 100,
  ...rest
}: PropType): ReactElement<SVGElement> {
  const clipId = useId();
  percentage = Math.min(100, percentage);

  // NOTE: Changing `dimension` won't automatically be reflected on the
  // inner `path`s
  const dimension = 16;

  return (
    <svg
      color='var(--cherryPieVariant)'
      width={dimension}
      height={dimension}
      viewBox={`0 0 ${dimension} ${dimension}`}
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden
      {...rest}
    >
      <path
        d='M14.6555 7.14875L11.8367 9.60875L12.6811 13.2712C12.7258 13.4627 12.713 13.6631 12.6445 13.8474C12.5759 14.0316 12.4545 14.1916 12.2955 14.3072C12.1365 14.4229 11.9469 14.4891 11.7505 14.4976C11.5541 14.5061 11.3595 14.4565 11.1911 14.355L7.99673 12.4175L4.80923 14.355C4.64084 14.4565 4.44627 14.5061 4.24984 14.4976C4.05342 14.4891 3.86385 14.4229 3.70485 14.3072C3.54586 14.1916 3.42447 14.0316 3.35589 13.8474C3.2873 13.6631 3.27455 13.4627 3.31923 13.2712L4.16236 9.6125L1.34298 7.14875C1.19386 7.02014 1.08603 6.85036 1.03302 6.66071C0.980001 6.47107 0.984157 6.26999 1.04497 6.08269C1.10577 5.89539 1.22052 5.73022 1.37483 5.60788C1.52914 5.48554 1.71613 5.41149 1.91236 5.395L5.62861 5.07312L7.07923 1.61312C7.15499 1.43157 7.28276 1.27649 7.44647 1.16741C7.61018 1.05833 7.80251 1.00012 7.99923 1.00012C8.19596 1.00012 8.38828 1.05833 8.55199 1.16741C8.7157 1.27649 8.84348 1.43157 8.91923 1.61312L10.3742 5.07312L14.0892 5.395C14.2855 5.41149 14.4725 5.48554 14.6268 5.60788C14.7811 5.73022 14.8958 5.89539 14.9566 6.08269C15.0174 6.26999 15.0216 6.47107 14.9686 6.66071C14.9156 6.85036 14.8077 7.02014 14.6586 7.14875H14.6555Z'
        fill='currentColor'
        clipPath={`url(#${clipId})`}
      />

      <defs>
        <clipPath id={clipId}>
          <rect width={(dimension * percentage) / 100} height={dimension} />
        </clipPath>
      </defs>
    </svg>
  );
}
