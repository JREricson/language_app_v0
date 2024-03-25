import React, { useEffect } from 'react';
import { Jwt } from '../features/auth/models/interfaces/Jwt';
import { logout } from '../features/auth/authSlice';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { stdJSONConfig } from '../features/common/headerConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const RefreshAuthOrRedirect = () => {

  const dispatch = useAppDispatch();

  const { isLoading, isSuccess, hasError, err_message, jwt, isAuthenticated } = useAppSelector((state) => state.auth);



  const REACT_APP_API_PATH: string | undefined = process.env.REACT_APP_API_PATH;

  const navigate = useNavigate();
  useEffect(() => {
    const refreshTokens = async () => {


      if (localStorage.jwt) {

        const parsed_jwt: Jwt = JSON.parse(localStorage.jwt);
        const refresh_token: string = parsed_jwt.refresh;
        console.log(refresh_token);

        try {
          const response = await axios.post(`${REACT_APP_API_PATH}auth/jwt/refresh/`, { 'refresh': refresh_token }, stdJSONConfig);

          if (response.status === 200) {
            localStorage.jwt = JSON.stringify(response.data);
          } else {
            throw Error(`wrong status code. value: ${response.status}`);
          }


        } catch (error) {
          console.log(error);
          dispatch(logout);


          localStorage.removeItem('jwt');
          toast.warn("You have been logged out");
          navigate("/login");
        }

      } else {
        console.log('no jwt ');
      }






    };

    const seconds = 1000;//milliseconds
    refreshTokens();
    setInterval(refreshTokens, 10 * seconds);


  }, []);





  return (
    <></>);
};

export default RefreshAuthOrRedirect;