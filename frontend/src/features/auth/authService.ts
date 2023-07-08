import axios from 'axios';
import jwt_decode from 'jwt-decode';

import { DecodedJwt } from './models/interfaces/DecodedJwt';

import { UserPublic } from './models/interfaces/UserPublic';
import { Jwt } from './models/Jwt';
import { LoginCredentials } from './models/interfaces/LoginCredentials';
import { UserNew } from './models/UserNew';
import { stdJSONConfig } from '../common/headerConfig';

const API_PATH: string = '/api/v0'

const register = async (newUser: UserNew): Promise<UserPublic | null> => {
  const response = await axios.post(`${API_PATH}/auth/users/`, newUser, stdJSONConfig);

  return response.data;
};

const login = async (loginCredentials: LoginCredentials): Promise<{ jwt: Jwt; user: UserPublic | null }> => {
  const response = await axios.post(
    `${API_PATH}/auth/jwt/create/`,
    loginCredentials,
    stdJSONConfig
  );

  if (response.data) {
    localStorage.setItem('jwt', JSON.stringify(response.data));

    const decodedJwt: DecodedJwt = jwt_decode(response.data.token);
    localStorage.setItem('user', JSON.stringify(decodedJwt.user));
    return { jwt: response.data, user: decodedJwt.user };

  }
  return { jwt: response.data, user: null };
};

const logout = (): void => {
  localStorage.removeItem('user');
  localStorage.removeItem('jwt');
};

const authService = {
  register,
  login,
  logout,
  // verifyJwt,
};

export default authService;

// TODO delete below
// const ACTIVATE_URL = '/api/v0/auth/users/activation/';
