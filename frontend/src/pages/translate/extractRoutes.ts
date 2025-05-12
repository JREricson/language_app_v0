import ExtractPage from "./ExtractPage";

const BASE: string = "/extract";

export const translate_routes = {
  translate_home: {
    path: `${BASE}/`,
    component: ExtractPage,
    display_str: "Extract Page",
  },
};
