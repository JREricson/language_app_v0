import { PaginatedResults } from "../../../common/interfaces/PaginatedResult";
import Profile from "../../../components/Profile";
import ProfilePublic from "../../../type_interfaces/ProfilePublic";

// export interface ProfilesResult extends PaginatedResult {
//   results: ProfilePublic[];
// }
export interface ProfilesResult {
  profiles: PaginatedResults<ProfilePublic>;
}
