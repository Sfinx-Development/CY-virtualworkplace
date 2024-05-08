import {
  Avatar,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OwnerRequest, Profile } from "../../../../types";
import {
  DeleterofileAsync,
  createOwnerRequest,
  getActiveProfile,
} from "../../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../../slices/store";
import { GetMyTeamsAsync, getActiveTeam } from "../../../slices/teamSlice";

export default function ProfileInformation() {
  const [openTodoPopup, setOpenTodoPopup] = useState(false);
  const dispatch = useAppDispatch();
  const profiles = useAppSelector((state) => state.profileSlice.profiles);
  const [profileOwnerReqest, setProfileOwnerRequest] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>();
  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );
  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getActiveTeam());
    dispatch(getActiveProfile());
  }, []);

  const handleLeaveTeam = async () => {
    if (activeProfile) {
      await dispatch(DeleterofileAsync(activeProfile));
      await dispatch(GetMyTeamsAsync());
      navigate("/chooseteam");
    }
  };

  useEffect(() => {
    if (profiles) {
      const profilesNotOwners = profiles.filter((p) => p.isOwner == false);
      setFilteredProfiles(profilesNotOwners);
    }
  }, [profiles]);

  const handleCreateOwnerRequest = async () => {
    if (activeTeam && profileOwnerReqest != "") {
      const ownerRequest: OwnerRequest = {
        id: "",
        profileId: profileOwnerReqest,
        teamName: activeTeam.name,
        isOwner: false,
        isConfirmed: false,
      };
      await dispatch(createOwnerRequest(ownerRequest));
    }
  };

  return (
    <Container sx={{ display: "flex", height: "100%", gap: 4, padding: 1 }}>
      <div style={{ flex: 1, padding: 2 }}>
        <Paper sx={{ padding: 2, marginTop: 2 }}>
          <Avatar src={activeProfile?.avatarUrl}></Avatar>
          <Typography>{activeProfile?.fullName}</Typography>
          <Typography>{activeProfile?.role}</Typography>
          <Typography>
            Medlem sedan {new Date(activeProfile!.dateCreated).getFullYear()}
          </Typography>
          <Typography>
            {activeProfile?.isOwner ? "Ägare" : "Inte ägare"}
          </Typography>
          <Button onClick={() => setOpenTodoPopup(true)}>
            Lämna {activeTeam?.name}
          </Button>
          <Dialog open={openTodoPopup} onClose={() => setOpenTodoPopup(false)}>
            <DialogTitle>Ta bort</DialogTitle>
            <DialogContent dividers>
              <Typography>
                Är du säker på att du vill gå ur teamet {activeTeam?.name}?
              </Typography>

              <IconButton onClick={handleLeaveTeam}>
                <Typography>Ta bort</Typography>
              </IconButton>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenTodoPopup(false)}>Stäng</Button>
            </DialogActions>
          </Dialog>
        </Paper>
        {activeProfile?.isOwner && filteredProfiles && (
          <Paper sx={{ padding: 2, marginTop: 2 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 600, marginBottom: 2 }}>
              Bjud in medlem till att bli ägare
            </Typography>
            <FormControl fullWidth>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={profileOwnerReqest ?? "Välj"}
                onChange={(event) => setProfileOwnerRequest(event.target.value)}
              >
                {filteredProfiles.map((p, index) => (
                  <MenuItem key={index} value={p.id}>
                    {p.fullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button onClick={handleCreateOwnerRequest}>Skicka inbjudan</Button>
          </Paper>
        )}
      </div>
    </Container>
  );
}
