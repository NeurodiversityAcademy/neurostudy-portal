import { FORM_STATE } from '@/app/utilities/auth/constants';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  formState: FORM_STATE;
  username: string;
}

const initialState = {
  formState: FORM_STATE.INITIALIZED,
  username: '',
} as Partial<InitialState>;

export const FormState = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormState: (_, actions: PayloadAction<FORM_STATE>) => {
      return {
        formState: actions.payload,
      };
    },
    setUsername: (_, actions: PayloadAction<string>) => {
      return {
        username: actions.payload,
      };
    },
    resetForm: () => {
      return initialState;
    },
  },
});

export const { setFormState, setUsername, resetForm } = FormState.actions;
export default FormState.reducer;
