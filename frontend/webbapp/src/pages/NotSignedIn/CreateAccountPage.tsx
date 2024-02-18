import {
  Avatar,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { PhoneNumberUtil } from "google-libphonenumber";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { avatars } from "../../../avatars";
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
  const [selectedAvatar, setSelectedAvatar] = useState("");
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
      age &&
      selectedAvatar
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
          avatarUrl: selectedAvatar,
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div>
        <Typography variant="h5" sx={{ margin: 2 }}>
          Skapa ett konto
        </Typography>
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
        <TextField
          label="Förnamn"
          variant="outlined"
          type="fname"
          value={firstname}
          onChange={(event) => setFirstname(event.target.value)}
          sx={{ margin: 1 }}
        />
        <TextField
          label="Efternamn"
          variant="outlined"
          type="lname"
          value={lastname}
          onChange={(event) => setLastname(event.target.value)}
          sx={{ margin: 1 }}
        />
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          type="email"
          onChange={(event) => setEmail(event.target.value)}
          sx={{ margin: 1 }}
        />
        <TextField
          label="Telefonnummer"
          variant="outlined"
          value={phoneNumber}
          type="tel"
          onChange={(event) => setPhoneNumber(event.target.value)}
          sx={{ margin: 1 }}
        />
        <TextField
          label="Lösenord"
          variant="outlined"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          sx={{ margin: 1 }}
        />
        <TextField
          label="Bekräfta lösenord"
          variant="outlined"
          type="password"
          value={confirmedPassword}
          onChange={(event) => setConfirmedPassword(event.target.value)}
          sx={{ margin: 1 }}
        />
        <FormControl variant="outlined" sx={{ margin: 1 }}>
          <InputLabel id="gender-label">Kön</InputLabel>
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
        <TextField
          label="Ålder"
          variant="outlined"
          type="number"
          value={age}
          onChange={(event) => setAge(Number(event.target.value))}
          sx={{ margin: 1 }}
        />
        <Typography variant="body1" sx={{ margin: 1 }}>
          Välj en avatar
        </Typography>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {avatars.map((avatar, index) => (
            <Avatar
              key={index}
              alt={`Avatar ${index + 1}`}
              src={avatar}
              sx={{
                cursor: "pointer",
                width: 70,
                height: 70,
                opacity: selectedAvatar == avatar ? "0.3" : "none",
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
      </div>
    </Container>
  );
}
