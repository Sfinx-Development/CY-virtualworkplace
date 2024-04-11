import {
  Avatar,
  Button,
  Card,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { isMobile } from "../../../globalConstants";
import { Profile, Team } from "../../../types";
import { GetTeamProfiles, getActiveProfile } from "../../slices/profileSlice";
import { GetTeamProjectsAsync } from "../../slices/projectSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam, updateAsync } from "../../slices/teamSlice";

export default function SettingsPage() {
  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);
  const profiles = useAppSelector((state) => state.profileSlice.profiles);
  const dispatch = useAppDispatch();
  const [newOwner, setNewOwner] = useState<Profile>();
  const [isOpenToJoin, setIsOpenToJoin] = useState<boolean>(
    activeTeam.isOpenToJoin
  );
  const [allCanCreateMeetings, setAllCanCreateMeetings] = useState<boolean>(
    activeTeam.allCanCreateMeetings
  );

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

  const handleChange = (event) => {
    setNewOwner(event.target.value);
  };

  const handleUpdateTeam = () => {
    if (activeTeam) {
      const updatedTeam: Team = {
        ...activeTeam,
        isOpenToJoin: isOpenToJoin,
        allCanCreateMeetings: allCanCreateMeetings,
      };
      dispatch(updateAsync(updatedTeam));
    }
  };

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
              control={
                <Switch
                  checked={isOpenToJoin}
                  onChange={(event) => setIsOpenToJoin(event.target.checked)}
                />
              }
              label="Alla kan gå med i teamet utan att skapa förfrågningar som godkänns av ägare"
            />
          </FormGroup>
        </Card>
        <Card sx={{ width: isMobile ? "100%" : "80%", padding: 1 }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={allCanCreateMeetings}
                  onChange={(event) =>
                    setAllCanCreateMeetings(event.target.checked)
                  }
                />
              }
              label="Alla i teamet kan skapa möten"
            />
          </FormGroup>
        </Card>
        <Card sx={{ width: isMobile ? "100%" : "80%", padding: 1 }}>
          <Typography variant="h6">Ägare i teamet</Typography>
          {Array.isArray(profiles) &&
            profiles
              .filter((profile) => profile.isOwner == true)
              .map((profile) => (
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

          <Typography sx={{ padding: 2 }}>
            Lägg till medlem som ägare
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Medlemmar</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={newOwner?.fullName}
              label="Medlemmar"
              onChange={handleChange}
            >
              {Array.isArray(profiles) &&
                profiles
                  .filter((profile) => !profile.isOwner)
                  .map((profile) => (
                    <MenuItem value={profile.fullName}>
                      {" "}
                      {profile.fullName}
                    </MenuItem>
                  ))}
            </Select>
          </FormControl>
        </Card>
        <Button
          variant="contained"
          onClick={handleUpdateTeam}
          sx={{ marginTop: 2, width: "250px" }}
        >
          Spara ändringar
        </Button>
      </div>
    </Container>
  );
}
