import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Container,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { User } from "../../../types";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { updateUserAsync } from "../../slices/userSlice";
import { theme1 } from "../../theme";

export default function UserSettings() {
  const user = useAppSelector((state) => state.userSlice.user);
  const [isEditMode, setIsEditMode] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const dispatch = useAppDispatch();

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

  return (
    <Container sx={{ padding: "20px" }}>
      <div
        style={{
          display: "grid",
          gap: "20px",
          gridTemplateColumns: "1fr",
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
          <Typography sx={{ marginLeft: 7 }}>Svenska</Typography>
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
          <Button sx={{ color: "primary.main", marginLeft: 7 }} disabled>
            Ta bort mitt konto permanent
          </Button>
        </Paper>
      </div>
    </Container>
  );
}
