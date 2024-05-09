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
import { DeleteTeam, GetMyTeamsAsync, getActiveTeam } from "../../../slices/teamSlice";

export default function ProfileInformation() {
  const [openTodoPopup, setOpenTodoPopup] = useState(false);
  const dispatch = useAppDispatch();
  const profiles = useAppSelector((state) => state.profileSlice.profiles);
  const [profileOwnerReqest, setProfileOwnerRequest] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>();
  const [isActiveProfileTheOnlyOwner, setIsActiveProfileTheOnlyOwner] =
    useState(false);
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
      if (activeProfile?.isOwner) {
        const owners = profiles.filter((p) => p.isOwner == true);
        if (owners.length > 1) {
          setIsActiveProfileTheOnlyOwner(false);
        } else {
          setIsActiveProfileTheOnlyOwner(true);
        }
      }
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

  const handleDeleteTeam = async () => {
    if (activeTeam) {
      await dispatch(DeleteTeam(activeTeam.id));
      navigate("/chooseteam");
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
          {activeProfile?.isOwner && isActiveProfileTheOnlyOwner && (
            <Dialog
              open={openTodoPopup}
              onClose={() => setOpenTodoPopup(false)}
            >
              <DialogTitle>Ta bort</DialogTitle>
              <DialogContent dividers>
                <Typography>
                  Är du säker på att du vill gå ur teamet {activeTeam?.name}? Då
                  du är ensam ägare av {activeTeam?.name} så kan du välja att
                  lägga till en annan medlem som ägare som kan fortsätta med
                  aktuellt team. Annars raderas teamet och all dess data
                  permanent.
                </Typography>

                <IconButton onClick={handleDeleteTeam}>
                  <Typography>Ta bort {activeTeam?.name}</Typography>
                </IconButton>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenTodoPopup(false)}>Stäng</Button>
              </DialogActions>
            </Dialog>
          )}
          {!activeProfile?.isOwner && (
            <Dialog
              open={openTodoPopup}
              onClose={() => setOpenTodoPopup(false)}
            >
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
          )}
          {activeProfile?.isOwner && !isActiveProfileTheOnlyOwner && (
            <Dialog
              open={openTodoPopup}
              onClose={() => setOpenTodoPopup(false)}
            >
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
          )}
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
