import Profile from "../../components/Profile";
import ProfilePublic from "../../type_interfaces/ProfilePublic";

// export interface PaginatedResult {
//   count: number;
//   next: null;
//   previous: string;
//   results: any[];
// }



export interface DjangoPagination {
  count: number;
  next: null;
  previous: string;
}

export interface PaginatedResults<Type> extends DjangoPagination {
  results: Type[];
}