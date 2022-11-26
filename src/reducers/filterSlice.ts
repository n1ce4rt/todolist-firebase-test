import { createSlice } from '@reduxjs/toolkit';

export type InitialStateType = {
  filter: 'All' | 'Done'| 'Progress'
}

const initialState: InitialStateType = {
  filter: 'All',
};

const filterSlice = createSlice({
  name:'filter',
  initialState,
  reducers: {
    changeFilter(state, action) {
      state.filter = action.payload;
    },
  },
});

export const {changeFilter} = filterSlice.actions;
export default filterSlice.reducer;
