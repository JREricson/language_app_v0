import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import ProfileCard from "../../components/ProfileCard";
import Spinner from "../../components/Spinner";
import Title from "../../components/Title";

import { logout, reset } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../app/hooks";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(logout());
    dispatch(reset());
    toast.success("You have been logged out.");
    navigate("/login");
  }, []);

  return (
    <>
      <Title title="LanguaVersity" />
      <Spinner />
      <h1>You are being Logged out</h1>
    </>
  );
};

export default LogoutPage;
