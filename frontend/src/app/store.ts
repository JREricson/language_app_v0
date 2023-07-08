import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import  authReducer from "../features/auth/authSlice";
import profileReducer from '../features/profiles/profileSlice';




export const store = configureStore({
  reducer: {
    profiles: profileReducer,
    auth: authReducer,

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
 