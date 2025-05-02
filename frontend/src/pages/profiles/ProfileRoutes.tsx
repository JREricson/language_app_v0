import ProfilesPage from "./ProfilesPage";
import ProfilePage from "./ProfilePage";
import ProfileEditPage from "./ProfileEditPage";

const BASE: string = "/profile";

export const profile_routes = {
  all_profiles_pg: {
    path: `${BASE}/all`,
    component: ProfilesPage,
    display_str: "All Profiles",
  },
  profile_pg: {
    path: `${BASE}/:user_id`,
    component: ProfilePage,
    display_str: "Profile Page",
  },
  profile_edit_pg: {
    path: `${BASE}/edit`,
    component: ProfileEditPage,
    display_str: "Edit Profile",
  },
};
