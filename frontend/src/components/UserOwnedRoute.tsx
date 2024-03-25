import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
// import { verifyJwt } from '../authSlice';

import jwt_decode from 'jwt-decode';


const UserOwnedRoute = ({ page, user_id_to_verify }: { page: JSX.Element, user_id_to_verify: string; }): JSX.Element => {
  const { isSuccess, isAuthenticated, jwt } = useAppSelector(
    (state) => state.auth
  );
  let userOwnsContent: boolean = false;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!jwt || !jwt?.access) {
      return;
    } else {

      // move to function in dispatch
      //   const user_from_jwt: string | null = !!jwt.access ? jwt_decode(jwt.access).user_id : null;
      //   if (user_from_jwt === user_id_to_verify) {
      //     userOwnsContent = true;
      //   }
      // }


      // dispatch(verifyJwt(jwt.access));

      //check user owns page
      userOwnsContent = true; //write some funct here
    }

  }, [jwt, isSuccess]);

  return (isAuthenticated && userOwnsContent) ? page : <Navigate replace to='/signin' />;
};

export default UserOwnedRoute;