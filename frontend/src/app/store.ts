import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import profileReducer from '../features/profiles/profileSlice';

export const store = configureStore({
  reducer: {
    profiles: profileReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
