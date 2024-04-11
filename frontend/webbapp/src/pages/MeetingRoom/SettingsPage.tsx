import {
  Avatar,
  Card,
  Container,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { isMobile } from "../../../globalConstants";
import { GetTeamProfiles, getActiveProfile } from "../../slices/profileSlice";
import { GetTeamProjectsAsync } from "../../slices/projectSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";

export default function SettingsPage() {
  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);
  const profiles = useAppSelector((state) => state.profileSlice.profiles);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getActiveTeam());
    dispatch(getActiveProfile());
  }, []);

  useEffect(() => {
    if (activeTeam) {
      dispatch(GetTeamProfiles(activeTeam?.id));
      dispatch(GetTeamProjectsAsync(activeTeam.id));
    }
  }, [activeTeam]);

  return (
    <Container
      sx={{
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Card sx={{ width: isMobile ? "100%" : "80%", padding: 1 }}>
          <FormGroup>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Alla kan gå med i teamet utan att skapa förfrågningar som godkänns av ägare"
            />
          </FormGroup>
        </Card>
        <Card sx={{ width: isMobile ? "100%" : "80%", padding: 1 }}>
          <FormGroup>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Alla i teamet kan skapa möten"
            />
          </FormGroup>
        </Card>
        <Card sx={{ width: isMobile ? "100%" : "80%", padding: 1 }}>
          <Typography variant="h6">Ägare i teamet</Typography>
          {Array.isArray(profiles) &&
            profiles.map((profile) => (
              <Typography
                key={profile.id}
                sx={{
                  marginBottom: 1,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 1,
                }}
              >
                <Avatar
                  src={profile.avatarUrl}
                  sx={{ height: 25, width: 20, marginRight: 1 }}
                />
                {profile.fullName}
              </Typography>
            ))}
        </Card>
      </div>
    </Container>
  );
}
