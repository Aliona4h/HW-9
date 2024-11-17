import React from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../api/userAction";
import { useNavigate } from "react-router-dom";
import { login } from "../store/slices/userSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Card, Button, Alert } from "react-bootstrap";
import * as Yup from "yup";

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string()
      .max(4, "Username must be 4 characters or less")
      .required("Username is required"),
    password: Yup.string()
      .max(4, "Password must be 4 characters or less")
      .required("Password is required"),
  });

  const handleLogin = async (
    values: { username: string; password: string },
    {
      setSubmitting,
      setErrors,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      setErrors: (errors: { username?: string }) => void;
    }
  ) => {
    try {
      const token = await loginUser(values.username, values.password);
      localStorage.setItem("token", token.access_token);
      dispatch(login(token.access_token));
      navigate("/");
    } catch {
      setErrors({ username: "Login failed. Please check your credentials." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card
      style={{ padding: "2rem", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
    >
      <h3 className="text-center mb-4">Login</h3>

      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            {errors.username && (
              <Alert variant="danger">{errors.username}</Alert>
            )}

            <div className="mb-3">
              <label>Username</label>
              <Field
                name="username"
                type="text"
                className="form-control"
                placeholder="Enter your username"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="mb-4">
              <label>Password</label>
              <Field
                name="password"
                type="password"
                className="form-control"
                placeholder="Enter your password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-100"
              disabled={isSubmitting}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>

      <Button
        variant="link"
        className="text-center mt-2"
        onClick={() => navigate("/register")}
      >
        Don't have an account? Register
      </Button>
    </Card>
  );
};
export default LoginForm;
