'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { resetForm } from '../redux/features/form/form-slice';

const useClickOutside = (onClose: () => void) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const dialog = document.querySelector('dialog');
      if (dialog && !dialog.contains(event.target as Node)) {
        onClose();
        dispatch(resetForm());
      }
    };

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [onClose, dispatch]);
};

export default useClickOutside;
