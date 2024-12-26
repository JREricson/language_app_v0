import { useEffect } from "react";
import { toast } from "react-toastify";
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
