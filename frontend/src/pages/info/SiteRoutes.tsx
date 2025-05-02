import AboutPage from "./AboutPage";
import HomePage from "./HomePage";

const BASE: string = "";

export const site_routes = {
  about_pg: {
    path: `${BASE}/about`,
    component: AboutPage,
    display_str: "About Page",
  },
  home_pg: {
    path: `${BASE}/`,
    component: HomePage,
    display_str: "Home Page",
  },
};
