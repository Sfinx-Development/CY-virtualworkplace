import { Button, Container, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { logInUserAsync } from "../../slices/userSlice";

export default function SignIn() {
  const user = useAppSelector((state) => state.userSlice.user);
  const dispatch = useAppDispatch();

  const handleSignIn = async () => {
    try {
      await dispatch(
        logInUserAsync({
          email: "angelinaholmqvist@live.se",
          password: "Hej123",
        })
      );
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
        {user ? <Typography>{user.firstName} är inloggad</Typography> : null}
      </div>
    </Container>
  );
}
