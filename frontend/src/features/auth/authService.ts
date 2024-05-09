import axios from "axios";
import jwt_decode from "jwt-decode";

import { DecodedJwt } from "./interfaces/DecodedJwt";

import { UserPublic } from "./interfaces/UserPublic";
import { Jwt } from "./interfaces/Jwt";
import { LoginCredentials } from "./interfaces/LoginCredentials";
import { UserNew } from "./models/UserNew";
import {
  appJsonHeadersBasedOnTokenInLocStorage,
  appJsonAxiosConfig as appJsonAxiosConfig,
} from "../../common/AxiosConfigUtil";
import { UserActivateRequest } from "./interfaces/UserActivateRequest";
import { access } from "fs";
import { LoginReturn } from "./interfaces/LoginReturn";
import { Headers } from "../../common/AxiosConfigUtil";

const REACT_APP_API_PATH: string | undefined = process.env.REACT_APP_API_PATH;

const register = async (newUser: UserNew): Promise<UserPublic | null> => {
  const response = await axios.post(
    //should return 201 --  created
    `${REACT_APP_API_PATH}auth/users/`,
    newUser,
    appJsonAxiosConfig
  );

  return response.data;
};

const login = async (
  loginCredentials: LoginCredentials
): Promise<LoginReturn> => {
  const login_resp = await axios.post(
    `${REACT_APP_API_PATH}auth/jwt/create/`,
    loginCredentials,
    appJsonAxiosConfig
  );

  localStorage.setItem("jwt_access", login_resp.data.access);
  localStorage.setItem("jwt_refresh", login_resp.data.refresh);

  const headers: Headers = appJsonHeadersBasedOnTokenInLocStorage();
  const user_resp = await axios.get(`${REACT_APP_API_PATH}auth/users/me/`, {
    headers,
  });

  const jwt: Jwt = {
    refresh: login_resp.data.refresh,
    access: login_resp.data.access,
  };
  const user: UserPublic = user_resp.data;

  return { jwt, user };
};

const logout = () => {
  // tokens removed from local storage in reducer
  const jwt_refresh: string | null = localStorage.getItem("jwt_refresh");
  console.log(`result of blacklist <${jwt_refresh}>`);
  if (jwt_refresh != null) {
    // Should return 200--  no content with body = {}
    // axios.post(
    //   `${REACT_APP_API_PATH}token/blacklist/`,
    //   `{"refresh": "${jwt_refresh}"}`,
    //   stdAxiosConfig
    // );
    localStorage.removeItem("jwt_refresh");
    localStorage.removeItem("jwt_access");
  }
};

const activate = async (
  activateRequest: UserActivateRequest
): Promise<void> => {
  //should return 204--  no content with o body

  await axios.post(
    `${REACT_APP_API_PATH}auth/users/activation/`,
    activateRequest,
    appJsonAxiosConfig
  );

  //TODO --  check response - if {}, we good, if not, try to send proper error

  // return response.data;
};

const authService = {
  register,
  login,
  logout,
  activate,
  // verifyJwt,
};

export default authService;
