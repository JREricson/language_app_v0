import { CmdOption } from "./CmdLineModal";
import { profile_routes } from "../../pages/profiles/ProfileRoutes";
import { site_routes } from "../../pages/info/SiteRoutes";
import { public_auth_routes } from "../../pages/auth/PublicAuthRoutes";

const route_opts: CmdOption[] = [];

const navigate_to_page = (page: string) => {
  window.location.href = page;
};
const navigate_to_page_with_cur_user_id_param = (page: string) => {
  const user_id = localStorage.getItem("user_id");
  let new_link = page.split(":")[0];
  if (user_id != null) {
    new_link += user_id;
  }

  window.location.href = new_link;
};

const all_routes = {
  ...profile_routes,
  ...site_routes,
  ...public_auth_routes,
};

Object.entries(all_routes).forEach(([key, route]) => {
  // We do not auto-populate the handler for anything that takes a param,
  // designated by a ":"
  if (!route.path.includes(":")) {
    route_opts.push({
      display_str: `Navigate => ${route.display_str}`,
      value: key,
      handler: () => navigate_to_page(route.path),
    });
  }
});

route_opts.push({
  display_str: `Navigate => ${profile_routes.profile_pg.display_str}`,
  value: "profile_pg",
  handler: () =>
    navigate_to_page_with_cur_user_id_param(profile_routes.profile_pg.path),
});

export const cmd_line_route_options = route_opts;
