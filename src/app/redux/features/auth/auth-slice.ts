import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AuthUser } from 'aws-amplify/auth';

interface InitialState {
  user: AuthUser | undefined;
}

const initialState = <InitialState>{
  user: undefined,
};

export const AuthState = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (_, actions: PayloadAction<InitialState['user']>) => {
      return {
        user: actions.payload,
      };
    },
  },
});

export const { setUser } = AuthState.actions;
export default AuthState.reducer;
