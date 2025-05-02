import { useEffect } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import Title from "../../components/reuseable/Title";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toast } from "react-toastify";
import { ReducerStatus } from "../../common/ReducerStatus";
import { reset, activate } from "../../features/auth/authSlice";
import { UserActivateRequest } from "../../features/auth/interfaces/UserActivateRequest";
import { public_auth_routes } from "./PublicAuthRoutes";
const ActivatePage = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { status, err_message, hasError } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (status === ReducerStatus.Failed) {
      toast.error(err_message);
    }

    if (status === ReducerStatus.Success) {
      navigate("/");
    }

    dispatch(reset());
  }, [status, err_message, navigate, dispatch]);

  const submitHandler = () => {
    if (uid && token) {
      const req: UserActivateRequest = {
        uid,
        token,
      };

      dispatch(activate(req));
      toast.success("Your account has been activated! You can login now");
      window.location.href = public_auth_routes.login_pg.path;
    }
  };

  return (
    <>
      <Title title="Activate User" />
      <Container>
        <Row>
          <Col className="mg-top text-center">
            <section>
              <h1>Activate your account</h1>
              <hr className="hr-text" />
            </section>
          </Col>
        </Row>
        {status === ReducerStatus.Loading && <Spinner />}
        <Row className="mt-3">
          <Col className="text-center">
            <Button
              type="submit"
              variant="outline-success"
              size="lg"
              className="mt-3 large-btn"
              onClick={submitHandler}
            >
              Activate
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ActivatePage;
