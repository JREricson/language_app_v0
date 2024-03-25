import axios from 'axios';
import jwt_decode from 'jwt-decode';

import { DecodedJwt } from './models/interfaces/DecodedJwt';

import { UserPublic } from './models/interfaces/UserPublic';
import { Jwt } from './models/interfaces/Jwt';
import { LoginCredentials } from './models/interfaces/LoginCredentials';
import { UserNew } from './models/UserNew';
import { stdJSONConfig } from '../common/headerConfig';

const REACT_APP_API_PATH: string | undefined = process.env.REACT_APP_API_PATH;

const register = async (newUser: UserNew): Promise<UserPublic | null> => {
  const response = await axios.post(`${REACT_APP_API_PATH}auth/users/`, newUser, stdJSONConfig);

  return response.data;
};

const login = async (loginCredentials: LoginCredentials): Promise<Jwt | null> => {
  const response = await axios.post(
    `${REACT_APP_API_PATH}auth/jwt/create/`,
    loginCredentials,
    stdJSONConfig
  );

  if (response.data) {
    localStorage.setItem('jwt', JSON.stringify(response.data));
    const decodedJwt: DecodedJwt = jwt_decode(response.data.access);
    localStorage.setItem('user_id', JSON.stringify(decodedJwt.user_id));

    const jwt: Jwt = {
      refresh: JSON.stringify(response.data.refresh),
      access: JSON.stringify(response.data.access),
    };

    return jwt;
  }
  return null;
};

const logout = (): void => {
  localStorage.removeItem('user'); // TODO check user is set somewhere
  localStorage.removeItem('user_id');
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
