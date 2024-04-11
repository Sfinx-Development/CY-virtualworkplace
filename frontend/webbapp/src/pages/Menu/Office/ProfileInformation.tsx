import { Button, Card, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DeleterofileAsync,
  getActiveProfile,
} from "../../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../../slices/store";
import { GetMyTeamsAsync, getActiveTeam } from "../../../slices/teamSlice";

export default function ProfileInformation() {
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
    <Container>
      <Card>
        <Typography>Namn: {activeProfile?.fullName}</Typography>
        <Typography>Roll: {activeProfile?.role}</Typography>
        <Typography>Ägare: {activeProfile?.isOwner ? "Ja" : "Nej"}</Typography>
        <Button onClick={handleLeaveTeam}>Lämna {activeTeam?.name}</Button>
      </Card>
    </Container>
  );
}
