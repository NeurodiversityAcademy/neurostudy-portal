'use client';

import Image from 'next/image';
import Close from '../../../app/images/close.svg';
import { ReactEventHandler } from 'react';

interface CloseButtonProps {
  onClick?: ReactEventHandler<HTMLButtonElement>;
  className?: string;
  style?: React.CSSProperties;
}

const CloseButton = ({ onClick, className, style }: CloseButtonProps) => {
  return (
    <button onClick={onClick} className={className} style={style}>
      <Image src={Close} alt={Close}></Image>
    </button>
  );
};

export default CloseButton;
