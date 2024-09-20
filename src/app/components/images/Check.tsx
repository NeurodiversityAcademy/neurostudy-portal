import { ReactElement } from 'react';

export default function CheckIcon(
  props: React.SVGProps<SVGSVGElement>
): ReactElement<SVGElement> {
  return (
    <svg
      width='12'
      height='10'
      viewBox='0 0 12 10'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M11.7071 0.792893C12.0976 1.18342 12.0976 1.81658 11.7071 2.20711L4.70711 9.20711C4.31658 9.59763 3.68342 9.59763 3.29289 9.20711L0.292893 6.20711C-0.0976311 5.81658 -0.0976311 5.18342 0.292893 4.79289C0.683417 4.40237 1.31658 4.40237 1.70711 4.79289L3.64645 6.73223C3.84171 6.9275 4.15829 6.9275 4.35355 6.73223L10.2929 0.792893C10.6834 0.402369 11.3166 0.402369 11.7071 0.792893Z'
        fill='currentColor'
      />
    </svg>
  );
}
