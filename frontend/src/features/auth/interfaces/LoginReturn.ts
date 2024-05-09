import { Jwt } from "./Jwt";
import { UserPublic } from "./UserPublic";

export interface LoginReturn {
  jwt: Jwt;
  user: UserPublic;
}
