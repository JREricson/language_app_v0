import { UserPublic } from './UserPublic';

export interface DecodedJwt {
  user: UserPublic;
  exp: number;
  iat: number;
}
