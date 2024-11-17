import React from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/userAction";
import { Container, Card, Button, Alert } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const RegisterForm: React.FC<{}> = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string()
      .max(4, "Username must be 4 characters or less")
      .required("Username is required"),
    password: Yup.string()
      .max(4, "Password must be 4 characters or less")
      .required("Password is required"),
  });

  const handleRegister = async (
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
      await registerUser(values.username, values.password);
      navigate("/login");
    } catch {
      setErrors({ username: "Registration failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card
        style={{
          maxWidth: "400px",
          padding: "2rem",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 className="text-center mb-4">Create an account</h3>

        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
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
                Register
              </Button>
            </Form>
          )}
        </Formik>

        <Button
          variant="link"
          className="text-center mt-2"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </Button>
      </Card>
    </Container>
  );
};

export default RegisterForm;
