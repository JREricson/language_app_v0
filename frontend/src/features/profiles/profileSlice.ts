import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import profileAPIService from "./profileAPIService";
import ProfilePublic from "../../type_interfaces/ProfilePublic";
import { attemptServiceRejectWithErr } from "../../common/FeatureUtils";
import { AsyncState } from "../../common/AsyncState";
import { ReducerStatus } from "../../common/ReducerStatus";
import { ProfilesResult } from "./interfaces/ProfilesResponse";
import { DjangoPagination } from "../../common/interfaces/PaginatedResult";

export interface ProfileState extends AsyncState {
  profiles: ProfilePublic[];
  pagination: DjangoPagination | null;
}

const initialState = {
  profiles: [] as ProfilePublic[],
  //TODO -- add single profile???
  hasError: false,
  status: ReducerStatus.Idle,
  err_message: "",
  pagination: null,
  // TODO include error response?
} satisfies ProfileState as ProfileState;

export const getProfiles = createAsyncThunk(
  "profiles/all",
  async (_, thunkAPI): Promise<ProfilesResult> => {
    return await attemptServiceRejectWithErr(
      profileAPIService.getProfiles,
      null,
      thunkAPI
    );
  }
);

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    reset: (state) => {
      state.profiles = [];
      state.status = ReducerStatus.Idle;
      state.hasError = false;
      state.err_message = "";
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    //TODO export into reuseable method

    builder
      .addCase(getProfiles.pending, (state) => {
        state.status = ReducerStatus.Loading;
        state.hasError = false;
        state.err_message = "";
      })
      .addCase(getProfiles.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = ReducerStatus.Success;
        console.log(
          `get profiles succeed <${JSON.stringify(action.payload.profiles)}>`
        );
        const { results, ...pagination } = action.payload.profiles;
        state.profiles = action.payload.profiles.results as ProfilePublic[];
        state.pagination = pagination as DjangoPagination;
      })
      .addCase(getProfiles.rejected, (state, action: PayloadAction<any>) => {
        console.log("get profiles rejected");
        state.status = ReducerStatus.Failed;
        state.hasError = true;
        state.err_message = action.payload as string;
      });
  },
});

export const { reset } = profileSlice.actions;
export default profileSlice.reducer;
