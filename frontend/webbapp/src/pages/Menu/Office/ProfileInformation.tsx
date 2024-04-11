import {
  Avatar,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DeleterofileAsync,
  getActiveProfile,
} from "../../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../../slices/store";
import { GetMyTeamsAsync, getActiveTeam } from "../../../slices/teamSlice";

export default function ProfileInformation() {
  const [openTodoPopup, setOpenTodoPopup] = useState(false);
  const dispatch = useAppDispatch();
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

  return (
    <Container sx={{ display: "flex", height: "100%", gap: 4, padding: 4 }}>
      <Card sx={{ flex: 1, padding: 2 }}>
        <Avatar src={activeProfile?.avatarUrl}></Avatar>
        <Typography>{activeProfile?.fullName}</Typography>
        <Typography>{activeProfile?.role}</Typography>
        <Typography>
          {activeProfile?.isOwner ? "Ägare" : "Inte ägare"}
        </Typography>
        <Typography>
          Medlem sedan {new Date(activeProfile!.dateCreated).getFullYear()}
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
      </Card>
    </Container>
  );
}
