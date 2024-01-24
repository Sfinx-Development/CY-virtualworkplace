import { Button, Container, Typography } from "@mui/material";
import { useState } from "react";
import { LogInWithJwt } from "../../../types";
import { FetchSignIn } from "../../api/logIn";

export default function SignIn() {
  const [loggedInUser, setLoggedInUser] = useState<LogInWithJwt>();

  const handleSignIn = async () => {
    try {
      const response = await FetchSignIn("angelinaholmqvist@live.se", "Hej123");
      if (response) {
        setLoggedInUser(response);
      }
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  return (
    <Container sx={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">SIGN IN PAGE</Typography>
        <Button variant="contained" onClick={handleSignIn}>
          Sign In
        </Button>
        {loggedInUser ? (
          <Typography>{loggedInUser.email} är inloggad</Typography>
        ) : null}
      </div>
    </Container>
  );
}
