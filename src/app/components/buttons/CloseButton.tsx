'use client';

import Image from 'next/image';
import Close from '../../../app/images/close.svg';
import { ReactEventHandler } from 'react';

interface CloseButtonProps {
  onClick?: ReactEventHandler<HTMLButtonElement>;
  className?: string;
}

const CloseButton = ({ onClick, className }: CloseButtonProps) => {
  return (
    <button onClick={onClick} className={className}>
      <Image src={Close} alt={Close}></Image>
    </button>
  );
};

export default CloseButton;
