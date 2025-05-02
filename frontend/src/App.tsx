import { FC } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Footer from "./components/site_layout/Footer";
import Header from "./components/site_layout/Header";

import ActivatePage from "./pages/auth/ActivatePage";
import ResetPasswordConfirmPage from "./pages/auth/ResetPasswordConfirmPage";

import EmailResetPage from "./pages/auth/EmailResetPage";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./components/reuseable/NotFound";
import RefreshAuthOrRedirect from "./components/site_auth/RefreshAuthOrRedirect";
import { profile_routes } from "./pages/profiles/ProfileRoutes";
import { translate_routes } from "./pages/translate/translateRoutes";
import { site_routes } from "./pages/info/SiteRoutes";
import { public_auth_routes } from "./pages/auth/PublicAuthRoutes";
import { WEBSITE_NAME } from "./common/global_app_constants";
const REACT_APP_API_PATH: string | undefined = process.env.REACT_APP_API_PATH;

function addRoutes(routes: object) {
  return Object.values(routes).map((route) => {
    console.log(route.path);
    return (
      <Route key={route.path} path={route.path} element={<route.component />} />
    );
  });
}

const App: FC = () => {
  return (
    <div className="App">
      <h1>{WEBSITE_NAME}</h1>
      <>
        <Router>
          <Header />
          <RefreshAuthOrRedirect />
          <main className="py-3">
            <Routes>
              {addRoutes(profile_routes)}
              {addRoutes(translate_routes)}
              {addRoutes(site_routes)}
              {/* auth */}
              {addRoutes(public_auth_routes)}
              <Route
                path="/password/reset/confirm/:uid/:token"
                element={<ResetPasswordConfirmPage />}
              />
              <Route path="/activate/:uid/:token" element={<ActivatePage />} />
              <Route
                path="/email/reset/confirm/:uid/:token"
                element={<EmailResetPage />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer theme="dark" hideProgressBar={true} />
          </main>
          <Footer />
        </Router>
      </>
    </div>
  );
};

export default App;
