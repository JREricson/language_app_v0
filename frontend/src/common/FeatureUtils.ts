import { GetThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { isAxiosError } from "axios";

export const errBasedOnAxiosCall = (error: unknown): string => {
  let msg: string = "";
  if (isAxiosError(error)) {
    msg += error.message;
    msg += "\n" + error.response?.status;
    msg += "\n" + JSON.stringify(error.response?.data, null, 2);
  } else {
    console.log(error);
    msg = "Unknown Error";
    console.log(msg);
  }
  return msg;
};

export const attemptServiceRejectWithErr = async (
  serviceFunc: Function,
  req: any,
  thunkAPI: GetThunkAPI<any>
) => {
  try {
    if (req !== null) {
      return await serviceFunc(req);
    } else {
      return await serviceFunc();
    }
  } catch (error: unknown) {
    console.log(`err generated on <${req}>`);
    const errMsg: string = errBasedOnAxiosCall(error);
    return thunkAPI.rejectWithValue(errMsg);
  }
};
