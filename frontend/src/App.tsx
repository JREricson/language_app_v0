import React, { FC, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomePage from "./pages/site_info/HomePage";
import AboutPage from "./pages/site_info/AboutPage";
import ActivatePage from "./pages/auth/ActivatePage";
import ResetPasswordConfirmPage from "./pages/auth/ResetPasswordConfirmPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import EmailResetPage from "./pages/auth/EmailResetPage";

import "react-toastify/dist/ReactToastify.css";
import NotFound from "./components/NotFound";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import LogoutPage from "./pages/auth/LogoutPage";
import UserOwnedRoute from "./components/UserOwnedRoute";
import RefreshAuthOrRedirect from "./components/RefreshAuthOrRedirect";

import { profile_routes } from "./pages/profiles/ProfileRoutes";
import { translate_routes } from "./pages/translate/translateRoutes";

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
      {/* TODO - make app name a global value, find all other occurrences */}
      <h1>LanguaVersity</h1>

      <>
        <Router>
          <Header />
          <RefreshAuthOrRedirect />
          <main className="py-3">
            <Routes>
              {/* <Route path='/' element={<UserOwnedRoute page={<HomePage />} />} /> */}
              <Route path="/" element={<HomePage />} />
              {addRoutes(profile_routes)}
              {addRoutes(translate_routes)}

              {/* auth */}
              {/* TODO create auth routes */}
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/logout" element={<LogoutPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
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
            <ToastContainer theme="dark" />
          </main>
          <Footer />
        </Router>
      </>
    </div>
  );
};

export default App;
