import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  windowWidth: number;
}

const initialState = <InitialState>{
  windowWidth: 1150,
};

export const WindowState = createSlice({
  name: 'window',
  initialState,
  reducers: {
    setWindowWidth: (_, actions: PayloadAction<number>) => {
      return {
        windowWidth: actions.payload,
      };
    },
  },
});

export const { setWindowWidth } = WindowState.actions;
export default WindowState.reducer;
