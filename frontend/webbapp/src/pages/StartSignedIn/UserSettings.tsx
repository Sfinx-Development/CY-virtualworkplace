import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
  keyframes,
} from "@mui/material";
import { useState } from "react";
import { User } from "../../../types";
import { useLanguageContext } from "../../contexts/languageContext";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { deleteUserAsync, updateUserAsync } from "../../slices/userSlice";
import { theme1 } from "../../theme";
import { useNavigate } from "react-router-dom";

export default function UserSettings() {
  const user = useAppSelector((state) => state.userSlice.user);
  const [isEditMode, setIsEditMode] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const dispatch = useAppDispatch();
  const { language } = useLanguageContext();
  const navigate = useNavigate();

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleUpdateUser();
    }
  };

  const handleUpdateUser = () => {
    if (
      firstName != "" &&
      lastName != "" &&
      phoneNumber != "" &&
      email != "" &&
      user
    ) {
      const updateUser: User = {
        ...user,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
      };
      dispatch(updateUserAsync(updateUser));
      setIsEditMode(false);
    }
  };

  const handleSetUpdateMode = () => {
    if (user) {
      setFirstName(user?.firstName);
      setLastName(user?.lastName);
      setPhoneNumber(user?.phoneNumber);
      setEmail(user?.email);

      setIsEditMode(true);
    }
  };

  const handleDeleteAccount = async () => {
    if (user) {
      await dispatch(deleteUserAsync());
      navigate("/");
    }
  };

  const gradientAnimation = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  `;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        background: "linear-gradient(45deg, #333333, #666666)",
        animation: `${gradientAnimation} 10s ease infinite`,
        color: "#FFF",
        overflow: "hidden",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: "20px",
          gridTemplateColumns: "1fr",
          width: "98%",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <Paper elevation={3} sx={{ padding: 2, borderRadius: 5 }}>
          <div
            style={{
              marginBottom: 2,
              paddingLeft: 56,
              marginRight: 56,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6">Personliga uppgifter</Typography>
            <IconButton size="small" onClick={() => handleSetUpdateMode()}>
              <EditIcon />
            </IconButton>
          </div>
          <hr
            style={{
              width: "90%",
              borderColor: theme1.palette.primary.main,
              marginBottom: "15px",
            }}
          />
          {isEditMode ? (
            <div>
              <TextField
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                fullWidth
                variant="outlined"
                onKeyDown={handleKeyPress}
              />
              <TextField
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                fullWidth
                variant="outlined"
                onKeyDown={handleKeyPress}
              />
              <TextField
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                type="text"
                fullWidth
                variant="outlined"
                onKeyDown={handleKeyPress}
              />{" "}
              <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                fullWidth
                variant="outlined"
                onKeyDown={handleKeyPress}
              />
            </div>
          ) : (
            <div>
              <Typography sx={{ marginBottom: 1, marginLeft: 7 }}>
                {user?.firstName}
              </Typography>
              <Typography sx={{ marginBottom: 1, marginLeft: 7 }}>
                {user?.lastName}
              </Typography>
              <Typography sx={{ marginBottom: 1, marginLeft: 7 }}>
                {user?.phoneNumber}
              </Typography>
              <Typography sx={{ marginBottom: 1, marginLeft: 7 }}>
                {user?.email}
              </Typography>
            </div>
          )}

          <Button sx={{ color: "primary.main", marginLeft: 7 }} disabled>
            Nytt lösenord
          </Button>
        </Paper>

        <Paper elevation={3} sx={{ padding: 2, borderRadius: 5 }}>
          <Typography variant="h6" sx={{ marginBottom: 2, marginLeft: 7 }}>
            Inställningar
          </Typography>
          <hr
            style={{
              width: "90%",
              borderColor: theme1.palette.primary.main,
              marginBottom: "15px",
            }}
          />
          <Typography sx={{ marginLeft: 7 }}>
            {language == "sv" ? "Svenska" : "English"}
          </Typography>
        </Paper>

        <Paper elevation={3} sx={{ padding: 2, borderRadius: 5 }}>
          <Typography variant="h6" sx={{ marginBottom: 2, marginLeft: 7 }}>
            Mitt konto
          </Typography>
          <hr
            style={{
              width: "90%",
              borderColor: theme1.palette.primary.main,
              marginBottom: "15px",
            }}
          />
          <Button
            sx={{ color: "primary.main", marginLeft: 6 }}
            onClick={handleDeleteAccount}
          >
            Ta bort mitt konto permanent
          </Button>
        </Paper>
      </div>
    </div>
  );
}
