import React, { FormEvent, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import isEmail from 'validator/lib/isEmail';


import Spinner from "../components/Spinner";
import Title from "../components/Title";
import { login, reset } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from '../app/hooks';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  const dispatch = useAppDispatch();

  const { isLoading, isSuccess, hasError, err_message } = useAppSelector((state) => state.auth);

  const navigate = useNavigate();



  const clearForm = (): void => {
    setEmail('');
    setPassword('');
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
      clearForm();
      navigate('/'); //TODO -  go to user's profile
      toast.success(
        "You have been successfully logged in"
      );
    }

    if (hasError) {
      toast.error(err_message);
      dispatch(reset());
    }
  }, [isSuccess, hasError, err_message, dispatch]);







  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const LoginData = {
      email,
      password,
    };
    dispatch(login(LoginData));


  };

  return (
    <>
      <Title title="Login" />
      <Container>
        <Row>
          <Col className="mg-top text-center">
            <section>
              <h1>
                <FaUser /> Login
              </h1>
              <hr className="hr-text" />
            </section>
          </Col>
        </Row>

        {isLoading && <Spinner />}
        <Row className="mt-3">
          <Col className="justify-content-center">
            <Form onSubmit={submitHandler}>


              <Form.Group controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>




              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />
              </Form.Group>



              <Button
                type="submit"
                variant="primary"
                className="mt-3"
              >
                Sign In
              </Button>
            </Form>
          </Col>
        </Row>

        <Row className="py-3">
          <Col>
            Need an account?&nbsp;
            <Link to="/register">Register</Link>
          </Col>
        </Row>
      </Container >
    </>
  );
};

export default LoginPage;