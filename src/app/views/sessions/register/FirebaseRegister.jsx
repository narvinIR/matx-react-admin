import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Formik } from "formik";
import * as Yup from "yup";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import styled from "@mui/material/styles/styled";
import LoadingButton from "@mui/lab/LoadingButton";
import useTheme from "@mui/material/styles/useTheme";
// GLOBAL CUSTOM COMPONENTS
import MatxDivider from "app/components/MatxDivider";
import { Paragraph } from "app/components/Typography";
import Loading from "app/components/MatxLoading";
// GLOBAL CUSTOM HOOKS
import useAuth from "app/hooks/useAuth";

// STYLED COMPONENTS
const ContentBox = styled("div")(({ theme }) => ({
  height: "100%",
  padding: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.background.default
}));

const IMG = styled("img")({ width: "100%" });

const GoogleButton = styled(Button)(({ theme }) => ({
  color: "rgba(0, 0, 0, 0.87)",
  backgroundColor: "#e0e0e0",
  boxShadow: theme.shadows[0],
  "&:hover": { backgroundColor: "#d5d5d5" }
}));

const RegisterRoot = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#1A2038",
  minHeight: "100vh !important",
  "& .card": { maxWidth: 750, margin: 16, borderRadius: 12 }
});

// initial login credentials
const initialValues = {
  email: "",
  password: "",
  remember: true
};

// form field validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be 6 character length")
    .required("Password is required!"),
  email: Yup.string().email("Invalid Email address").required("Email is required!")
});

export default function FirebaseRegister() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { createUserWithEmail, signInWithGoogle, isLoading, isAuthenticated } = useAuth();

  // Если пользователь уже аутентифицирован, редиректим на главную
  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleGoogleRegister = async () => {
    try {
      await signInWithGoogle();
      // Редирект произойдет автоматически после обновления isAuthenticated
    } catch (e) {
      console.error(e);
      enqueueSnackbar(e.message || "Google sign in failed", { variant: "error" });
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      await createUserWithEmail(values.email, values.password);
      enqueueSnackbar("Registration successful! Please wait...", { variant: "success" });
      // Редирект произойдет автоматически после обновления isAuthenticated
    } catch (e) {
      console.error(e);
      let errorMessage = "Registration failed";
      
      // Обработка специфических ошибок Firebase
      if (e.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered";
      } else if (e.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (e.code === "auth/operation-not-allowed") {
        errorMessage = "Email/password registration is not enabled";
      } else if (e.code === "auth/weak-password") {
        errorMessage = "Password is too weak";
      }
      
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  // Показываем глобальный лоадер при загрузке
  if (isLoading) {
    return <Loading />;
  }

  return (
    <RegisterRoot>
      <Card className="card">
        <Grid container>
          <Grid size={{ md: 6, xs: 12 }}>
            <ContentBox>
              <IMG src="/assets/images/illustrations/posting_photo.svg" alt="Photo" />
            </ContentBox>
          </Grid>

          <Grid size={{ md: 6, xs: 12 }}>
            <Box px={4} pt={4}>
              <GoogleButton
                fullWidth
                variant="contained"
                onClick={handleGoogleRegister}
                disabled={isLoading}
                startIcon={<img src="/assets/images/logos/google.svg" alt="google" />}>
                Sign In With Google
              </GoogleButton>
            </Box>

            <MatxDivider sx={{ mt: 3, px: 4 }} text="Or" />

            <Box p={4} height="100%">
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}>
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      name="email"
                      label="Email"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      disabled={isLoading}
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      name="password"
                      type="password"
                      label="Password"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      disabled={isLoading}
                      sx={{ mb: 1.5 }}
                    />

                    <Box display="flex" alignItems="center" gap={1}>
                      <Checkbox
                        size="small"
                        name="remember"
                        onChange={handleChange}
                        checked={values.remember}
                        disabled={isLoading}
                        sx={{ padding: 0 }}
                      />

                      <Paragraph fontSize={13}>
                        I have read and agree to the terms of service.
                      </Paragraph>
                    </Box>

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={isLoading}
                      variant="contained"
                      sx={{ my: 2 }}>
                      Register
                    </LoadingButton>

                    <Paragraph>
                      Already have an account?
                      <NavLink
                        to="/session/signin"
                        style={{ color: theme.palette.primary.main, marginLeft: 5 }}>
                        Login
                      </NavLink>
                    </Paragraph>
                  </form>
                )}
              </Formik>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </RegisterRoot>
  );
}
