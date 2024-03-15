import { UserPublic } from './UserPublic';

export interface DecodedJwt {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: string;
}
