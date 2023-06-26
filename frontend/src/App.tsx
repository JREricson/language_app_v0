import React, { FC, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HomePage from "./pages/HomePage"
import AboutPage from "./pages/AboutPage";
import { useAppDispatch, useAppSelector } from './app/hooks';
import { getProfiles } from './features/profiles/profileSlice';
import Profile from './components/Profile';
import ProfilesPage from './pages/ProfilesPage';


const App: FC = () => {


  return (
    <div className="App">
      <h1>LanguaVersity</h1>

      <>
        <Router>
          <Header />
          <main className="py-3">
            <Routes>
              <Route path="/" element={<HomePage />}></Route>
              <Route path="/profile/all" element={<ProfilesPage />}></Route>
            </Routes>
            <Routes>
              <Route
							path="/about"
							element={<AboutPage />}
						></Route>
            </Routes>
          </main>
          <Footer />
        </Router>
        {/* <ToastContainer /> */}
      </>

    </div>

  );
};

export default App;
