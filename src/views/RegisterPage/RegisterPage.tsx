import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useState, FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Alert, Stack } from "@mui/material";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error_, setError_] = useState(false);
  const [success, setSuccess ] = useState(false);


  const handleSubmit = (event: FormEvent) => {
    setError_(false)
    setSuccess(false)
    event.preventDefault();
    console.log(email, password);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        setSuccess(true);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setError_(true)
      });
    console.log(auth.currentUser)
  };

  return (
    <>
      <Stack
        sx={{ display: success ? "block" : "none", width: "100%" }}
        spacing={2}
      >
        <Alert
          variant="outlined"
          sx={{ backgroundColor: "rgba(70, 0, 0, .75)", color: "#14fa10" }}
          severity="info"
          onClose={() => {
            setSuccess(false);
          }}
        >
          Register successful. you can now login.
        </Alert>
      </Stack>
      <Stack
        sx={{ display: error_ ? "block" : "none", width: "100%" }}
        spacing={2}
      >
        <Alert
          variant="outlined"
          severity="error"
          sx={{ backgroundColor: "rgba(0, 0, 0, .75)", color: "red" }}
          onClose={() => {
            setError_(false);
          }}
        >
          Register unsuccessful. Please try again.
        </Alert>
      </Stack>
      <div
        className="gradient-bg"
        style={{ height: "90vh", paddingTop: "50px", paddingBottom: "881px" }}
      >
        <Container
          component="main"
          maxWidth="xs"
          sx={{ padding: "20px", backgroundColor: "rgb(255, 255, 255, 0.5)" }}
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(event) => setEmail(event.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Register
              </Button>
              <Button
                component={Link}
                href="/"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Back to Home
              </Button>
              <Grid container>
                <Grid item>
                  <Link
                    href="/log-in"
                    variant="body2"
                    style={{ color: "#be1e19" }}
                  >
                    {"Already have an account? Log In."}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </div>
    </>
  );
}