import { Card, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { getActiveProfile } from "../../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../../slices/store";
import { getActiveTeam } from "../../../slices/teamSlice";

export default function ProfileInformation() {
  const dispatch = useAppDispatch();
  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );

  useEffect(() => {
    dispatch(getActiveTeam());
    dispatch(getActiveProfile());
  }, []);
  return (
    <Container>
      <Card>
        <Typography>Namn: {activeProfile?.fullName}</Typography>
        <Typography>Roll: {activeProfile?.role}</Typography>
        <Typography>Ägare: {activeProfile?.isOwner ? "Ja" : "Nej"}</Typography>
        Här ska man kunna lämna teamet också
      </Card>
    </Container>
  );
}
