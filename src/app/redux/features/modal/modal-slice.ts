import { createSlice } from '@reduxjs/toolkit';

interface InitialState {
  isModalOpen: boolean;
}

const initialState = <InitialState>{
  isModalOpen: false,
};

export const ModalState = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    toggleModal: (state) => {
      state.isModalOpen = !state.isModalOpen;
    },
  },
});

export const { toggleModal } = ModalState.actions;
export default ModalState.reducer;
