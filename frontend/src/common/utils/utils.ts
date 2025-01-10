import { GetThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { isAxiosError } from "axios";

export const generateFetchErrMsg = (error: unknown): string => {
  let msg: string = "";

  if (error instanceof Error) {
  } else {
    throw error;
  }

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

export const attemptReduxServiceRejectWithErr = async (
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
    const errMsg: string = generateFetchErrMsg(error);
    return thunkAPI.rejectWithValue(errMsg);
  }
};

export const default_options = {
  headers: {
    "Content-Type": "application/json",
  },
};

export interface Headers {
  [key: string]: string;
}

export function fetchOptionsWithStoredToken() {
  /**
   * header has "Content-Type": "application/json"
   * If a jwt_access token is present in local storage it will be added to the header
   * "Authorization" = `Bearer ${accessToken}`
   *
   */
  const accessToken: string | null = localStorage.getItem("jwt_access");
  if (accessToken !== null) {
    let options: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    console.log("headers are");
    console.log(options.headers);
    return options;
  } else {
    return default_options;
  }
}

export function addParamToRoute(route: string, param: string): string {
  return route.substring(0, route.indexOf(":")) + param;
}

export function paramStrFromURL(url: string): string {
  const url_obj: URL = new URL(url);
  return url_obj.search;
}

export function extractContent(html: string) {
  // function taken from here
  //https://stackoverflow.com/questions/28899298/extract-the-text-out-of-html-string-using-javascript
  return new DOMParser().parseFromString(html, "text/html").documentElement
    .textContent;
}
