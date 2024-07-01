import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  isLoading: boolean;
}

const initialState = <InitialState>{
  isLoading: false,
};

export const LoaderState = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    setIsLoading: (_, actions: PayloadAction<boolean>) => {
      return {
        isLoading: actions.payload,
      };
    },
  },
});

export const { setIsLoading } = LoaderState.actions;
export default LoaderState.reducer;
