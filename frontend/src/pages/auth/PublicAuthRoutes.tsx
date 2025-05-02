import LoginPage from "./LoginPage";
import LogoutPage from "./LogoutPage";
import RegisterPage from "./RegisterPage";
import ResetPasswordPage from "./ResetPasswordPage";
const BASE: string = "";

export const public_auth_routes = {
  login_pg: {
    path: `${BASE}/login`,
    component: LoginPage,
    display_str: "Login Page",
  },
  logout_pg: {
    path: `${BASE}/logout`,
    component: LogoutPage,
    display_str: "Logout Page",
  },
  register_pg: {
    path: `${BASE}/register`,
    component: RegisterPage,
    display_str: "Register Page",
  },
  pw_reset_pg: {
    path: `${BASE}/reset-password`,
    component: ResetPasswordPage,
    display_str: "Reset Password Page",
  },
};
