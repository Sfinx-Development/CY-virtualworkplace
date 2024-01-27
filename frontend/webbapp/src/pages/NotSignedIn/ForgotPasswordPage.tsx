import { Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { forgotPasswordAsync } from "../../slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";


export default function ForgotPassword() {
  const success = useAppSelector((state) => state.authSlice.success);
  const error = useAppSelector((state) => state.authSlice.error);
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");

  //OM GÅTT BRA SÅ SKRIV UT KOLLA DIN MAIL - OM ERROR SÅ SKRIV UT FEL MAIL ELLER SÅ?

  const handleForgotPassword = async () => {
    try {
      await dispatch(forgotPasswordAsync({ email: email }));
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  return (
    <Container
      sx={{
        padding: "20px",
        height: "100vh",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: 1,
          backgroundColor: "pink",
          padding: 50,
        }}
      >
        EN LOGGA KANSKE OCH NÅGOT KUL?
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: 1,
          padding: 50,
        }}
      >
        {error ? (
          <Typography variant="h6">
            Något gick fel vid utskick av nytt lösenord.
          </Typography>
        ) : null}
        {success ? (
          <Typography variant="h6">
            Ett nytt lösenord har skickats till din email.
          </Typography>
        ) : null}

        <TextField
          id="standard-basic"
          label="Email"
          variant="standard"
          sx={{ width: "250px", marginTop: 5 }}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />

        <Button
          variant="contained"
          sx={{
            marginTop: 4,
            marginBottom: 1,
            paddingRight: 5,
            paddingLeft: 5,
          }}
          onClick={handleForgotPassword}
        >
          Nytt lösenord
        </Button>
      </div>
    </Container>
  );
}
