import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

import authService from "./authService";
import { UserPublic } from "./interfaces/UserPublic";
import { Jwt } from "./interfaces/Jwt";
import { RootState } from "../../app/store";
import { RegisterFormField } from "./interfaces/RegisterFormField";
import {
  attemptServiceRejectWithErr,
  errBasedOnAxiosCall,
} from "../../common/FeatureUtils";
import { LoginCredentials } from "./interfaces/LoginCredentials";

import { AsyncState } from "../../common/AsyncState";
import { ReducerStatus } from "../../common/ReducerStatus";
import { UserActivateRequest } from "./interfaces/UserActivateRequest";
// const storedUser: string | null = !!localStorage.getItem("user_id")//TODO delete or use
//   ? localStorage.getItem("user")
//   : null;
const user: UserPublic | null = null; //!!localStorage.getItem("user") ? JSON.parse(storedUser) : null; //TODO check if this can be broken from client end

const storedJwt: string | null = !!localStorage.getItem("jwt")
  ? localStorage.getItem("jwt")
  : null;
const jwt: Jwt | null = !!storedJwt ? JSON.parse(storedJwt) : null;

// TODO: move  Auth state outside of file

interface AuthState extends AsyncState {
  user: UserPublic | null;
  isAuthenticated: boolean;
}

const initialState = {
  user: user, // TODO check this is set right -- set to local storage???
  isAuthenticated: false,
  status: ReducerStatus.Idle,
  hasError: false,
  err_message: "",
} satisfies AuthState as AuthState;

export const register = createAsyncThunk(
  "auth/register",
  async (registerFormData: RegisterFormField, thunkAPI) => {
    return attemptServiceRejectWithErr(
      authService.register,
      registerFormData,
      thunkAPI
    );
  }
);

export const login = createAsyncThunk(
  "auth//jwt/create/",
  async (loginCredentials: LoginCredentials, thunkAPI) => {
    return attemptServiceRejectWithErr(
      authService.login,
      loginCredentials,
      thunkAPI
    );
  }
);

export const logout = createAsyncThunk("auth/logout", async (thunkAPI) => {
  // return attemptServiceRejectWithErr(authService.logout, null, null);
  localStorage.removeItem("jwt_refresh");
  localStorage.removeItem("jwt_access");
  localStorage.removeItem("user_id");
  try {
    const res = authService.logout();
    console.log(`result of blacklist <${res}>`);
  } catch (error) {
    //TODO log error
    // return thunkAPI.rejectWithValue(msg);
  }
});

export const activate = createAsyncThunk(
  "auth/activate",
  async (user: UserActivateRequest, thunkAPI) => {
    try {
      return await authService.activate(user);
    } catch (error: unknown) {
      const msg: string = errBasedOnAxiosCall(error);

      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.status = ReducerStatus.Idle;
      state.hasError = false;
      state.err_message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(register.pending, (state) => {
        state.status = ReducerStatus.Loading;
        state.hasError = false;
        state.err_message = "";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = ReducerStatus.Success;
        console.log(action.payload);
      })
      .addCase(register.rejected, (state, action) => {
        state.status = ReducerStatus.Failed;
        state.hasError = true;
        state.err_message = action.payload as string;
      })
      // LOGIN
      .addCase(login.pending, (state) => {
        state.status = ReducerStatus.Loading;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = ReducerStatus.Success;
        state.user = action.payload.user as UserPublic;

        state.isAuthenticated = true;
        console.log(`payload ${JSON.stringify(action.payload)}`);

        // TODO - store user in local storage -  load as initial state iff refresh token is valid
      })
      .addCase(login.rejected, (state, action) => {
        console.log("login failed");
        state.status = ReducerStatus.Failed;
        state.hasError = true;
        state.isAuthenticated = false;
        state.err_message = action.payload as string; // TODO maybe not have as user end message
      })
      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        // state.user = null;

        state.isAuthenticated = false;
      });
    //ACTIVATE
    // .addCase(activate.pending, (state) => {
    // 	state.status = ReducerStatus.Loading;
    // })
    // .addCase(activate.fulfilled, (state, action) => {
    // 	state.status = ReducerStatus.Success;

    // })
    // .addCase(activate.rejected, (state, action) => {
    //   state.status = ReducerStatus.Failed;
    //   state.hasError = true;
    //   state.err_message = action.payload as string;
    // })

    // VERIFY JWT
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
  //TODO delete???
  return state.auth.user;
};

export default authSlice.reducer;
