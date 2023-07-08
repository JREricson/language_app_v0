import React, { FC, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

const App: FC = () => {


  return (
    <div className="App">
      <h1>LanguaVersity</h1>

      <>
        <Router>
          <Header />
          <main className="py-3">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile/all" element={<ProfilesPage />} />
              <Route path="/register" element={<RegisterPage />} />
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
