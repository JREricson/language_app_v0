import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import profileAPIService from './profileAPIService';
import ProfilePublic from '../../type_interfaces/ProfilePublic';
import { handleAxiosErrorAndReturnErrMsgsAsStr } from '../common/ErrorHandlers';

const initialState = {
  profiles: [] as ProfilePublic[],
  // profile: {} as ProfilePublic,
  hasError: false,
  isLoading: false,
  isSuccess: false,
  message: '',
  // TODO include error response?
};
// TODO not used, use it or remove it
export interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  request: any;
}

export interface ProfileState {
  profiles: ProfilePublic[];
  // profile: {} as ProfilePublic,
  hasError: Boolean;
  isLoading: Boolean;
  isSuccess: Boolean;
  message: string;
  // TODO include error response?
}

// get all profiles
export const getProfiles = createAsyncThunk(
  'profiles/getAll', //TODO rename to all?
  async (_, thunkAPI) => {
    try {
      return await profileAPIService.getProfiles();
    } catch (error: unknown) {
      let msg: string = handleAxiosErrorAndReturnErrMsgsAsStr(error);

      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// }

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    //TODO export into reuseable method

    builder
      .addCase(getProfiles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfiles.fulfilled, (state, action: PayloadAction<any>) => {
        //ProfilePublic[]
        state.isLoading = false;
        state.isSuccess = true;
        state.profiles = action.payload.results as ProfilePublic[];
      })
      .addCase(getProfiles.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.hasError = true;
        state.message = action.payload as string; //TODO verify this is the correct way
      });
  },
});

export const { reset } = profileSlice.actions;
export default profileSlice.reducer;
