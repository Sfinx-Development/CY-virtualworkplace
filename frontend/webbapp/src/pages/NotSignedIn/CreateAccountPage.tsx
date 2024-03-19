import {
  Avatar,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,Grid
} from "@mui/material";
import { keyframes } from "@emotion/react";
import { PhoneNumberUtil } from "google-libphonenumber";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { avatars } from "../../../avatars";
import { isMobile } from "../../../globalConstants";
import { useAppDispatch } from "../../slices/store";
import { createUserAsync } from "../../slices/userSlice";

export default function CreateAccount() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [fieldsError, setFieldsError] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPhoneNumber = (phone: string) => {
    const phoneUtil = PhoneNumberUtil.getInstance();
    try {
      const phoneNumberProto = phoneUtil.parse(`+46${phone}`);
      const isValid = phoneUtil.isValidNumber(phoneNumberProto);
      return isValid;
    } catch (e) {
      console.error("NumberParseException was thrown:", e);
      return false;
    }
  };

  const handleCreateUser = async () => {
    setPasswordError(false);
    setPasswordLengthError(false);
    setEmailError(false);
    setPhoneError(false);
    setAgeError(false);
    setFieldsError(false);

    if (
      firstname &&
      lastname &&
      email &&
      password &&
      confirmedPassword &&
      phoneNumber &&
      gender &&
      age &&
      selectedAvatar
    ) {
      if (
        password === confirmedPassword &&
        password.length >= 6 &&
        isEmailValid(email) &&
        isPhoneNumber(phoneNumber) &&
        age >= 16
      ) {
        const newUser = {
          id: "",
          firstName: firstname,
          lastName: lastname,
          email: email,
          phoneNumber: phoneNumber,
          gender: gender,
          age: age,
          password: password,
          avatarUrl: selectedAvatar,
        };
        await dispatch(createUserAsync(newUser));
        navigate("/signin");
      } else {
        if (password !== confirmedPassword) {
          setPasswordError(true);
        } else if (password.length < 6 || confirmedPassword.length < 6) {
          setPasswordLengthError(true);
        } else if (!isEmailValid(email)) {
          setEmailError(true);
        } else if (!isPhoneNumber(phoneNumber)) {
          setPhoneError(true);
        } else if (age < 16) {
          setAgeError(true);
        } else {
          setFieldsError(true);
        }
      }
    } else {
      setFieldsError(true);
    }
  };

      // Keyframes för bakgrundsanimering
      const gradientAnimation = keyframes`
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    `;
  
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(45deg, #333333, #666666)",
          animation: `${gradientAnimation} 10s ease infinite`,
        }}
      >
        <div
       style={{
        background: "white",
        paddingLeft:10,
        paddingRight:10,
        justifyContent:"center",
        alignItems:"center",
        flexDirection:isMobile ? "column" : "row",
        borderRadius: 10,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
       }}
        >
          <Grid item xs={12} textAlign="center">
            <Typography variant="h5" sx={{ color: "#FFF" }}>
              Skapa ett konto
            </Typography>
          </Grid>
          {passwordError && (
          <Typography color="error">Lösenord matchar inte</Typography>
        )}
        {passwordLengthError && (
          <Typography color="error">
            Lösenordet måste bestå av minst 6 tecken
          </Typography>
        )}
        {phoneError && (
          <Typography color="error">Ange ett giltigt telefonnummer</Typography>
        )}
        {emailError && (
          <Typography color="error">Ange en giltig e-post</Typography>
        )}
        {ageError && (
          <Typography color="error">
            Du måste vara minst 16 år för att skapa ett konto
          </Typography>
        )}
        {fieldsError && (
          <Typography color="error">Alla fält måste fyllas i</Typography>
        )}
          <Grid item xs={12} sm={6} paddingTop={2}>
            <TextField
              label="Förnamn"
              variant="outlined"
              type="fname"
              value={firstname}
              onChange={(event) => setFirstname(event.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} paddingTop={2}>
            <TextField
              label="Efternamn"
              variant="outlined"
              type="lname"
              value={lastname}
              onChange={(event) => setLastname(event.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} paddingTop={2}>
            <TextField
              label="Email"
              variant="outlined"
              value={email}
              type="email"
              onChange={(event) => setEmail(event.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} paddingTop={2}>
            <TextField
              label="Telefonnummer"
              variant="outlined"
              value={phoneNumber}
              type="tel"
              onChange={(event) => setPhoneNumber(event.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} paddingTop={2}>
            <TextField
              label="Lösenord"
              variant="outlined"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} paddingTop={2}>
            <TextField
              label="Bekräfta lösenord"
              variant="outlined"
              type="password"
              value={confirmedPassword}
              onChange={(event) => setConfirmedPassword(event.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} paddingTop={2}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="gender-label" sx={{ color: "#FFF" }}>
                Kön
              </InputLabel>
              <Select
                labelId="gender-label"
                value={gender}
                label="Kön"
                onChange={(event) => setGender(event.target.value)}
              >
                <MenuItem value={"Man"}>Man</MenuItem>
                <MenuItem value={"Kvinna"}>Kvinna</MenuItem>
                <MenuItem value={"Ickebinär"}>Ickebinär</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} paddingTop={2}>
            <TextField
              label="Ålder"
              variant="outlined"
              type="number"
              value={age}
              onChange={(event) => setAge(Number(event.target.value))}
              fullWidth
            />
          </Grid>
       <Grid item xs={12} sm={6} paddingTop={2}>
            <Typography variant="body1" sx={{ color: "#FFF" }}>
              Välj en avatar
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 20,
                flexWrap: "wrap",
              }}
            >
              {avatars.map((avatar, index) => (
                <Avatar
                  key={index}
                  alt={`Avatar ${index + 1}`}
                  src={avatar}
                  sx={{
                    cursor: "pointer",
                    width: 70,
                    height: 70,
                    opacity: selectedAvatar === avatar ? 0.3 : 1,
                  }}
                  onClick={() => setSelectedAvatar(avatar)}
                />
              ))}
            </div>
            <Button
              variant="contained"
              onClick={handleCreateUser}
              sx={{ margin: 1, fontSize: 20 }}
            >
              Skapa konto
            </Button>
          </Grid>
        </div>
      </div>
    );
                }