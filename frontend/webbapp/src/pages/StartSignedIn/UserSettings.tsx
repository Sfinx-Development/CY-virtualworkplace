import EditIcon from "@mui/icons-material/Edit";
import { Container, IconButton, Paper, Typography } from "@mui/material";
import { useAppSelector } from "../../slices/store";
import { theme1 } from "../../theme";

export default function UserSettings() {
  const user = useAppSelector((state) => state.userSlice.user);

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
            <IconButton
              size="small"
              //   onClick={() => handleSetEditMode(meeting.meetingId)}
            >
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
          <Typography sx={{ color: "primary.main", marginLeft: 7 }}>
            Skapa ett nytt lösenord
          </Typography>
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
          <Typography sx={{ marginBottom: 1, marginLeft: 7 }}>
            Välja att radera mitt konto och lämna alla team och radera all min
            data
          </Typography>
        </Paper>
      </div>
    </Container>
  );
}
