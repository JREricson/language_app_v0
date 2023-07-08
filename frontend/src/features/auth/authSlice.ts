import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import authService from './authService';
import { UserPublic } from './models/interfaces/UserPublic';
import { Jwt } from './models/Jwt';
import { RootState } from '../../app/store';
import { RegisterFormField } from './models/interfaces/RegisterFormField';
import { handleAxiosErrorAndReturnErrMsgsAsStr } from '../common/ErrorHandlers';

const storedUser: string | null = localStorage.getItem('user');
const user: UserPublic | null = !!storedUser ? JSON.parse(storedUser) : null;

const storedJwt: string | null = localStorage.getItem('jwt');
const jwt: Jwt = !!storedJwt ? JSON.parse(storedJwt) : null;

// TODO: move higher
interface AsyncState {
  isLoading: boolean;
  isSuccess: boolean;
  hasError: boolean;
}

interface AuthState extends AsyncState {
  user?: UserPublic | null;
  jwt?: Jwt;
  isAuthenticated?: boolean;
  err_message: string;
}

const initialState: AuthState = {
  user: user,
  jwt: jwt,
  isAuthenticated: false,
  isLoading: false,
  isSuccess: false,
  hasError: false,
  err_message: '',
};

export const register = createAsyncThunk(
  'auth/register',
  async (userFromForm: RegisterFormField, thunkAPI) => {
    try {
      return await authService.register(userFromForm);
    } catch (error: unknown) {
      const msg: string = handleAxiosErrorAndReturnErrMsgsAsStr(error);

      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.hasError = false;
      state.err_message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.user = null;
        state.err_message = action.payload as string;
      });
    // LOGIN
    // .addCase(login.pending, (state) => {
    //   state.isLoading = true;
    // })
    // .addCase(login.fulfilled, (state, action) => {
    //   state.isLoading = false;
    //   state.isSuccess = true;
    //   state.jwt = action.payload.jwt;
    //   state.isAuthenticated = true;
    //   state.user = action.payload.user;
    // })
    // .addCase(login.rejected, (state) => {
    //   state.isLoading = false;
    //   state.hasError = true;
    //   state.user = null;
    //   state.isAuthenticated = false;
    //   state.user = null;
    // })
    // // LOGOUT
    // .addCase(logout.fulfilled, (state) => {
    //   state.user = null;
    //   state.jwt = null;
    //   state.isAuthenticated = false;
    // })
    // // VERIFY JWT
    // .addCase(verifyJwt.pending, (state) => {
    //   state.isLoading = true;
    // })
    // .addCase(verifyJwt.fulfilled, (state, action) => {
    //   state.isLoading = false;
    //   state.isSuccess = true;
    //   state.isAuthenticated = action.payload;
    // })
    // .addCase(verifyJwt.rejected, (state) => {
    //   state.isLoading = false;
    //   state.hasError = true;
    //   state.isAuthenticated = false;
    // });
  },
});

export const { reset } = authSlice.actions;

export const selectedUser = (state: RootState) => {
  return state.auth;
};

export default authSlice.reducer;
