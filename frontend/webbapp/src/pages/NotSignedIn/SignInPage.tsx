import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Button,
  Container,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { logInUserAsync } from "../../slices/userSlice";
//roomreducer?? kanske? så att allt ändras automatiskt med färger beroende på var du är inne på?
export default function SignIn() {
  const error = useAppSelector((state) => state.userSlice.error);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const handleSignIn = async () => {
    try {
      await dispatch(
        logInUserAsync({
          email: email,
          password: password,
        })
      ).then(() => navigate("/chooseteam"));
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
          <Typography variant="h6">Inloggning misslyckades</Typography>
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

        <FormControl sx={{ width: "250px", marginTop: 5 }} variant="standard">
          <InputLabel htmlFor="standard-adornment-password">
            Password
          </InputLabel>
          <Input
            id="standard-adornment-password"
            type={showPassword ? "text" : "password"}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <Button
          variant="contained"
          sx={{
            marginTop: 4,
            marginBottom: 1,
            paddingRight: 5,
            paddingLeft: 5,
          }}
          onClick={handleSignIn}
        >
          Logga in
        </Button>
        <Link href="forgotpassword" underline="hover">
          Glömt lösenord?
        </Link>

        <Button
          variant="contained"
          sx={{ marginTop: 2 }}
          onClick={handleSignIn}
        >
          Skapa Konto
        </Button>
      </div>
    </Container>
  );
}
