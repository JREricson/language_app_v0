import { useEffect } from "react";
import { Jwt } from "../../features/auth/interfaces/Jwt";
import { logout } from "../../features/auth/authSlice";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { requestConfig } from "../../common/AxiosConfigUtil";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { StatusCodes } from "http-status-codes";

const RefreshAuthOrRedirect = () => {
  const dispatch = useAppDispatch();

  let { status, hasError, err_message, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const REACT_APP_API_PATH: string | undefined = process.env.REACT_APP_API_PATH;

  const navigate = useNavigate();
  useEffect(() => {
    const refreshTokens = async () => {
      if (localStorage.getItem("jwt_refresh")) {
        // const parsed_jwt: Jwt = JSON.parse(localStorage.jwt);
        // const refresh_token: string = parsed_jwt.refresh;
        const refresh_token: string | null =
          localStorage.getItem("jwt_refresh");
        console.log(refresh_token);

        try {
          const response = await axios.post(
            `${REACT_APP_API_PATH}auth/jwt/refresh/`,
            { refresh: refresh_token },
            requestConfig
          );

          if (response.status === StatusCodes.OK) {
            const jwt: Jwt = response.data;
            localStorage.jwt_access = jwt.access;
            localStorage.jwt_refresh = jwt.refresh;
            isAuthenticated = true;
          } else {
            throw Error(`Wrong status code. value: <${response.status}>.`);
          }
        } catch (error) {
          console.log(error);
          dispatch(logout);

          localStorage.removeItem("jwt_access");
          localStorage.removeItem("jwt_refresh");
          //TODO this will keep getting a toast msg
          toast.warn("You have been logged out due to inactivity.");
          navigate("/login");
        }
      } else {
        console.log("no jwt ");
      }
    };
    //TODO - make sure set to value less than jwt expiration time
    const second = 1000; //milliseconds

    // refreshTokens();
    //TODO -  perform initial check based on expiration
    setInterval(refreshTokens, 10 * second);
  }, []);

  return <></>;
};

export default RefreshAuthOrRedirect;
