import { Button, Container, TextField, Typography } from "@mui/material";
import { PhoneNumberUtil } from "google-libphonenumber";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../../types";
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
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  };

  const isPhoneNumber = (phone: string): boolean => {
    const phoneUtil = PhoneNumberUtil.getInstance();
    try {
      //gäller bara för sverige nu då - borde kolla vra personen befinner sig
      //ev ha COUNTRY i usern? - översättning skapa också isåfall överallt till engelska iaf
      const phoneNumberProto = phoneUtil.parse(`+46${phone}`);
      const isValid = phoneUtil.isValidNumber(phoneNumberProto);

      if (isValid) {
        setPhoneError(false);
        console.log("IS VALID NUMBER");
        return true;
      } else {
        setPhoneError(true);
        console.log("IS NOT VALID NUMBER");
        return false;
      }
      return false;
    } catch (e) {
      console.error("NumberParseException was thrown:", e);
      //sätt error meddelande - något gick fel? eller vad?
      return false;
    }
  };

  const handleCreateUser = async () => {
    if (
      firstname &&
      lastname &&
      email &&
      password &&
      confirmedPassword &&
      phoneNumber &&
      gender &&
      age
    ) {
      if (
        password == confirmedPassword &&
        password.length >= 6 &&
        isEmail(email) &&
        isPhoneNumber(phoneNumber)
      ) {
        const newUser: User = {
          id: "",
          firstName: firstname,
          lastName: lastname,
          email: email,
          phoneNumber: phoneNumber,
          gender: gender,
          age: age,
          password: password,
        };
        await dispatch(createUserAsync(newUser));
        navigate("/signin");
      } else {
        if (password != confirmedPassword) {
          setPasswordError(true);
          setPasswordLengthError(false);
          setEmailError(false);
        } else if (password.length < 6 || confirmedPassword.length < 6) {
          setPasswordLengthError(true);
          setPasswordError(false);
          setEmailError(false);
        } else if (!isEmail(email)) {
          setEmailError(true);
        }
      }
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
        }}
      >
        <TextField
          id="firstname"
          label="Förnamn"
          variant="standard"
          sx={{ width: "250px", marginTop: 2 }}
          onChange={(event) => {
            setFirstname(event.target.value);
          }}
        />

        <TextField
          id="lastname"
          label="Efternamn"
          variant="standard"
          sx={{ width: "250px", marginTop: 2 }}
          onChange={(event) => {
            setLastname(event.target.value);
          }}
        />
        {emailError ? <Typography>Ange en giltig e-post</Typography> : null}
        <TextField
          id="email"
          label="Email"
          variant="standard"
          sx={{ width: "250px", marginTop: 2 }}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        {passwordError ? <Typography>Lösenord matchar inte</Typography> : null}
        {passwordLengthError ? (
          <Typography>Lösenordet måste bestå av minst 6 tecken</Typography>
        ) : null}
        <TextField
          id="password"
          label="Lösenord"
          variant="standard"
          sx={{ width: "250px", marginTop: 2 }}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />

        <TextField
          id="confirmpassword"
          label="Bekräfta lösenord"
          variant="standard"
          sx={{ width: "250px", marginTop: 2 }}
          onChange={(event) => {
            setConfirmedPassword(event.target.value);
          }}
        />
        {phoneError ? (
          <Typography>Ange en giltigt telefonnummer</Typography>
        ) : null}
        <TextField
          id="phonenumber"
          label="Telefonnummer"
          variant="standard"
          sx={{ width: "250px", marginTop: 2 }}
          onChange={(event) => {
            setPhoneNumber(event.target.value);
          }}
        />

        <TextField
          id="gender"
          label="Kön"
          variant="standard"
          sx={{ width: "250px", marginTop: 2 }}
          onChange={(event) => {
            setGender(event.target.value);
          }}
        />

        <TextField
          id="age"
          label="Ålder"
          variant="standard"
          sx={{ width: "250px", marginTop: 2 }}
          onChange={(event) => {
            setAge(Number(event.target.value));
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
          onClick={handleCreateUser}
        >
          Skapa konto
        </Button>
      </div>
    </Container>
  );
}
