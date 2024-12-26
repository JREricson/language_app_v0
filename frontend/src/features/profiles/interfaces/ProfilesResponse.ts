import { PaginatedResults } from "../../../common/interfaces/PaginatedResult";
import ProfileCard from "../../../components/ProfileCard";
import ProfilePublic from "../../../type_interfaces/ProfilePublic";

// export interface ProfilesResult extends PaginatedResult {
//   results: ProfilePublic[];
// }

export interface ProfilesResult {
  profiles: PaginatedResults<ProfilePublic>;
}
