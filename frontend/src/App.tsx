import React, { FC, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import { useAppDispatch, useAppSelector } from './app/hooks';
import { getProfiles } from './features/profiles/profileSlice';
import Profile from './components/Profile';
import ProfilesPage from './pages/ProfilesPage';
import "react-toastify/dist/ReactToastify.css";
import NotFound from './components/NotFound';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import UserOwnedRoute from './components/UserOwnedRoute';
import RefreshAuthOrRedirect from './components/RefreshAuthOrRedirect';


const REACT_APP_API_PATH: string | undefined = process.env.REACT_APP_API_PATH;

const App: FC = () => {



  return (
    <div className="App">
      <h1>LanguaVersity</h1>

      <>
        <Router>
          <Header />
          <RefreshAuthOrRedirect/>
          <main className="py-3">
            <Routes>

              {/* <Route path='/' element={<UserOwnedRoute page={<HomePage />} />} /> */}
              <Route path="/" element={<HomePage />} />
              <Route path="/profile/all" element={<ProfilesPage />} />
              {/* auth */}
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/logout" element={<LogoutPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer theme='dark' />

          </main>
          <Footer />
        </Router>
      </>

    </div>

  );
};

export default App;
