import React, { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';


import Profile from '../components/Profile';
import Spinner from '../components/Spinner';
import Title from '../components/Title';

import { logout, reset } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useNavigate } from 'react-router-dom';


const LogoutPage = () => {

  const navigate = useNavigate();

  const { hasError, isLoading, isAuthenticated, err_message, } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  useEffect(() => {

    dispatch(logout());
    dispatch(reset());
    if (!isAuthenticated) {
      toast.success("You have been logged out.");
      navigate('/login');
    } else {
      toast.success("An unknown error occurred.");
    }
  },);




  return (
    <>
      <Title title="LanguaVersity" />
      <h1>You are being Logged out</h1>

    </>
  );
};

export default LogoutPage;
