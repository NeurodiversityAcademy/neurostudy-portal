import { createSlice } from '@reduxjs/toolkit';

interface InitialState {
  isDropdownVisible: boolean;
}

const initialState = <InitialState>{
  isDropdownVisible: false,
};

export const NavBarState = createSlice({
  name: 'navbar',
  initialState,
  reducers: {
    toggleDropdown: (state) => {
      state.isDropdownVisible = !state.isDropdownVisible;
    },
    closeDropdown: () => {
      return {
        isDropdownVisible: false,
      };
    },
  },
});

export const { toggleDropdown, closeDropdown } = NavBarState.actions;
export default NavBarState.reducer;
