'use client';

// NOTE
// Although this returns a component, primary function of this file is to
// be rendered once in the application's life cycle to ensure Amplify is
// configured on the client side.

import { Amplify } from 'aws-amplify';
import awsconfig from '@/app/aws-exports';
import { useEffect } from 'react';
import {
  addAuthEventListener,
  removeAuthEventListener,
  startListening,
} from './authListener';
import { AUTH_EVENT_TYPE, PayloadType } from './constants';
import { AuthUser } from 'aws-amplify/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '@/app/redux/features/auth/auth-slice';

Amplify.configure(awsconfig, { ssr: true });

const ConfigureAmplifyClientSide: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unlistener = startListening();

    const onSignedIn = ({ payload }: { payload: PayloadType }) => {
      const data = payload.data as AuthUser;
      dispatch(setUser(data));
    };

    const onSignedOut = () => {
      dispatch(setUser(undefined));
    };

    addAuthEventListener(AUTH_EVENT_TYPE.SIGNED_IN, onSignedIn);
    addAuthEventListener(AUTH_EVENT_TYPE.SIGNED_OUT, onSignedOut);

    return () => {
      unlistener();

      removeAuthEventListener(AUTH_EVENT_TYPE.SIGNED_IN, onSignedIn);
      removeAuthEventListener(AUTH_EVENT_TYPE.SIGNED_OUT, onSignedOut);
    };
  }, [dispatch]);

  return null;
};

export default ConfigureAmplifyClientSide;
