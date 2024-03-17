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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { GetMyTeamsAsync } from "../../slices/teamSlice";
import { logInUserAsync, logOutUserAsync } from "../../slices/userSlice";
//roomreducer?? kanske? så att allt ändras automatiskt med färger beroende på var du är inne på?
export default function SignIn() {
  const error = useAppSelector((state) => state.userSlice.error);
  const user = useAppSelector((state) => state.userSlice.user);
  const teams = useAppSelector((state) => state.teamSlice.teams);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  const [showCookieConsent, setShowCookieConsent] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  useEffect(() => {
    const hasConsented = localStorage.getItem("cookieConsent");
    if (!hasConsented) {
      setShowCookieConsent(true);
    }
  }, []);

  const handleCookieConsent = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowCookieConsent(false);
  };

  useEffect(() => {
    console.log("LOGGAR UT");
    dispatch(logOutUserAsync());
  }, []);

  const handleSignIn = async () => {
    try {
      console.log("LOGGAR IN");
      await dispatch(
        logInUserAsync({
          email: email,
          password: password,
        })
      );
      await dispatch(GetMyTeamsAsync());
      setSignedIn(true);
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  useEffect(() => {
    if (user && !error && teams && signedIn) {
      console.log("HÄR INNE");
      navigate("/chooseteam");
    }
  }, [user, teams, signedIn]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSignIn();
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
          padding: 50,
        }}
      >
        {showCookieConsent && (
          <div>
            <Typography variant="body1">
              Denna webbplats använder tredjepartscookies för att förbättra din
              upplevelse. Godkänn användningen av cookies för att fortsätta.
            </Typography>
            <Button
              variant="contained"
              onClick={handleCookieConsent}
              sx={{ marginTop: 2 }}
            >
              Jag accepterar
            </Button>
          </div>
        )}
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
          onKeyDown={handleKeyPress}
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
            onKeyDown={handleKeyPress}
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
          onClick={() => {
            navigate("/createaccount");
          }}
        >
          Skapa Konto
        </Button>
      </div>
    </Container>
  );
}
