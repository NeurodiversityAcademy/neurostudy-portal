'use client';

import { Hub } from 'aws-amplify/utils';
import { AUTH_EVENT_TYPE, PayloadType } from './constants';

type EventFunctionType = ({ payload }: { payload: PayloadType }) => void;

interface ListenersType {
  [key: string]: EventFunctionType[];
}

const listeners: ListenersType = {};

export const startListening = () => {
  return Hub.listen('auth', ({ payload }) => {
    (listeners[payload.event] || []).forEach((callback) =>
      callback({ payload: payload as PayloadType })
    );
  });
};

export const addAuthEventListener = (
  e: AUTH_EVENT_TYPE,
  callback: EventFunctionType
) => {
  if (!(e in listeners)) {
    listeners[e] = [];
  }

  listeners[e].push(callback);
};

export const removeAuthEventListener = (
  e: AUTH_EVENT_TYPE,
  callback: EventFunctionType
) => {
  if (e in listeners) {
    listeners[e] = listeners[e].filter((listener) => callback !== listener);
  }
};
