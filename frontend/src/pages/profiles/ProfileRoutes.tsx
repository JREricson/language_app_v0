import ProfilesPage from "./ProfilesPage";
import ProfilePage from "./ProfilePage";
import ProfileEditPage from "./ProfileEditPage";
import { Component } from "react";

const BASE: string = "/profile";

export const profile_routes = {
  all_profiles_pg: { path: `${BASE}/all`, component: ProfilesPage },
  profile_pg: { path: `${BASE}/:user_id`, component: ProfilePage },
  profile_edit_pg: { path: `${BASE}/edit`, component: ProfileEditPage },
};
