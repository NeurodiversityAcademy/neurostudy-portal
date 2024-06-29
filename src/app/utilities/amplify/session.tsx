'use client';

import { setUser } from '@/app/redux/features/auth/auth-slice';
import { AuthUser } from 'aws-amplify/auth';
import { useDispatch } from 'react-redux';

const Session = ({ user }: { user: AuthUser | undefined }) => {
  const dispatch = useDispatch();
  dispatch(setUser(user));
  return null;
};

export default Session;
