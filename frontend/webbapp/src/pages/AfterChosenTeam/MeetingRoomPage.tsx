import { Card, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { GetMyProfileAsync } from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";
import { theme1 } from "../../theme";

export default function MeetingRoom() {
  const dispatch = useAppDispatch();
  // const activeProfile = useAppSelector(
  //   (state) => state.profileSlice.activeProfile
  // );
  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);

  useEffect(() => {
    dispatch(getActiveTeam());
  }, []);

  useEffect(() => {
    if (activeTeam) {
      dispatch(GetMyProfileAsync(activeTeam?.id));
    }
  }, [activeTeam]);

  const backgroundImageUrl = "https://i.imgur.com/EC5f1XS.jpeg";
  // const isMobile = window.innerWidth <= 500;
  const meetingRoomColor = theme1.palette.room.main;
  return (
    <Container
      sx={{
        padding: "20px",
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Card sx={{ padding: 2, backgroundColor: meetingRoomColor }}>
        <Typography> {activeTeam?.name}'s mötesrum</Typography>
      </Card>
    </Container>
  );
}
