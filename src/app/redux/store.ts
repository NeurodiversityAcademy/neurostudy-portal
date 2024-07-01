import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import navBarReducer from './features/navbar/navbar-slice';
import loaderReducer from './features/loader/loader-slice';
import modalReducer from './features/modal/modal-slice';
import formReducer from './features/form/form-slice';
import windowReducer from './features/window/window.slice';
import authReducer from './features/auth/auth-slice';

export const store = configureStore({
  reducer: {
    navBarReducer,
    loaderReducer,
    modalReducer,
    formReducer,
    windowReducer,
    authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
