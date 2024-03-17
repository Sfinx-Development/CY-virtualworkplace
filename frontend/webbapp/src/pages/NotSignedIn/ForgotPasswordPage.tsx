import AppsIcon from "@mui/icons-material/Apps";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { isMobile } from "../../../globalConstants";
import { forgotPasswordAsync } from "../../slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { theme1 } from "../../theme";

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
          flex: 1,
          backgroundColor: theme1.palette.primary.main,
          padding: 50,
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: isMobile ? 15 : 20,
            fontWeight: "550",
            marginBottom: isMobile ? 1 : 2,
          }}
        >
          Skydda dina lösenord
        </Typography>
        <Box sx={{ display: "flex" }}>
          <KeyboardIcon sx={{ fontSize: isMobile ? 15 : 20 }} />
          <Typography
            sx={{
              fontSize: isMobile ? 12 : 15,
              marginLeft: isMobile ? 0.5 : 1,
            }}
          >
            Använd specialtecken
          </Typography>
        </Box>
        <Box sx={{ display: "flex" }}>
          <AppsIcon sx={{ fontSize: isMobile ? 15 : 20 }} />
          <Typography
            sx={{
              fontSize: isMobile ? 12 : 15,
              marginLeft: isMobile ? 0.5 : 1,
            }}
          >
            Använd inte samma lösenord på flera tjänster
          </Typography>
        </Box>
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
