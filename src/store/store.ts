import { configureStore } from '@reduxjs/toolkit';
import tasksSlice from '../reducers/tasksSlice';
import filterSlice from '../reducers/filterSlice';

export const store = configureStore({
  reducer: {
    tasksSlice,
    filterSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch