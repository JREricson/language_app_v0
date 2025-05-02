import TranslatePage from "./TranslatePage";

const BASE: string = "/translate";

export const translate_routes = {
  translate_home: {
    path: `${BASE}/`,
    component: TranslatePage,
    display_str: "Translate Page",
  },
};
