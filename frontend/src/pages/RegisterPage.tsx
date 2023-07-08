import React, { FormEvent, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import isEmail from 'validator/lib/isEmail';


import Spinner from "../components/Spinner";
import Title from "../components/Title";
import { register, reset } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from '../app/hooks';

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [re_password, setRePassword] = useState("");


  const dispatch = useAppDispatch();

  const { isLoading, isSuccess, hasError, err_message } = useAppSelector((state) => state.auth);

  const navigate = useNavigate();



  const clearForm = (): void => {
    setUsername('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setRePassword('');
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(reset());
      clearForm();
      navigate('/login');
      toast.success(
        "An activation link has been sent to the email provided. Click the link to activate your account."
      );
    }

    if (hasError) {
      toast.error(err_message);
      dispatch(reset());
    }
  }, [isSuccess, hasError,err_message, dispatch]);



  const doesFormPassSimpleValidationAndSetErrorMsgs = (): boolean => {

    let passValidation = true;
    if (password.length < 8) {
      passValidation = false;
      toast.error("Password needs to be more than 8 characters.");

    }

    if (password !== re_password) {
      passValidation = false;
      toast.error("Passwords do not match.");

    }

    if (first_name.length < 1 || last_name.length < 1 || username.length < 1) {
      passValidation = false;
      toast.error("first name, username, and last name must be at least 1 character");
    }

    if (!isEmail(email)) {
      passValidation = false;
      toast.error("Please provide a valid email address.");
    }

    return passValidation;

  };




  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let simpleValidationPassed: boolean = doesFormPassSimpleValidationAndSetErrorMsgs();



    if (simpleValidationPassed) {
      const userData = {
        username,
        first_name,
        last_name,
        email,
        password,
        re_password,
      };
      dispatch(register(userData));
    }

  };
  return (
    <>
      <Title title="Register" />
      <Container>
        <Row>
          <Col className="mg-top text-center">
            <section>
              <h1>
                <FaUser /> Register
              </h1>
              <hr className="hr-text" />
            </section>
          </Col>
        </Row>

        {isLoading && <Spinner />}
        <Row className="mt-3">
          <Col className="justify-content-center">
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="name"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group controlId="first_name">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="name"
                  placeholder="Enter First Name"
                  value={first_name}
                  onChange={(e) =>
                    setFirstName(e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group controlId="last_name">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="name"
                  placeholder="Enter Last Name"
                  value={last_name}
                  onChange={(e) =>
                    setLastName(e.target.value)
                  }
                />
              </Form.Group>

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

              <Form.Group controlId="re-password">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter confirm Password"
                  value={re_password}
                  onChange={(e) =>
                    setRePassword(e.target.value)
                  }
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="mt-3"
              >
                Sign Up
              </Button>
            </Form>
          </Col>
        </Row>

        <Row className="py-3">
          <Col>
            Have an account already?
            <Link to="/login">Login</Link>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RegisterPage;