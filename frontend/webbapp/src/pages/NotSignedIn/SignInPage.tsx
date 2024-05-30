import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Button,
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
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../../globalConstants";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { GetMyTeamsAsync } from "../../slices/teamSlice";
import { logInUserAsync, logOutUserAsync } from "../../slices/userSlice";
//roomreducer?? kanske? så att allt ändras automatiskt med färger beroende på var du är inne på?
export default function SignIn() {
  const logInError = useAppSelector((state) => state.userSlice.logInError);
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
    dispatch(logOutUserAsync());
  }, []);

  const handleSignIn = async () => {
    try {
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
    if (user && !logInError && teams && signedIn) {
      navigate("/chooseteam");
    }
  }, [user, teams, signedIn]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSignIn();
    }
  };

  return (
    <div
      style={{
        padding: isMobile ? 0 : "0px",
        height: "100vh",
        width: "100%",
        backgroundImage:
          "linear-gradient(315deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.9) 74%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: isMobile ? 25 : 50,
          background: "#FFF",
          borderRadius: 10,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {showCookieConsent && (
          <div>
            <Typography variant="body1">
              <FormattedMessage id="signIn1_coocie_text" />
            </Typography>
            <Button
              variant="contained"
              onClick={handleCookieConsent}
              sx={{ marginTop: 2 }}
            >
              <FormattedMessage id="signIn2_button_cookieOk" />
            </Button>
          </div>
        )}
        {logInError ? (
          <Typography variant="h6">
            <FormattedMessage id="signIn3-inlog" />
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
          onKeyDown={handleKeyPress}
        />

        <FormControl sx={{ width: "250px", marginTop: 5 }} variant="standard">
          <InputLabel htmlFor="standard-adornment-password">
            <FormattedMessage id="signIn4_password_label" />
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
            color: "#FFF",
          }}
          onClick={handleSignIn}
        >
          <FormattedMessage id="signIn5_button_signIn" />
        </Button>
        <Link href="forgotpassword" underline="hover">
          <FormattedMessage id="signIn6_link_forgotP" />
        </Link>

        <Button
          variant="contained"
          sx={{ marginTop: 2, color: "#FFF" }}
          onClick={() => {
            navigate("/createaccount");
          }}
        >
          <FormattedMessage id="signIn7_create" />
        </Button>
      </div>
    </div>
  );
}
