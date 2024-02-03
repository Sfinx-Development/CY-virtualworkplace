import { Card, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { GetMyProfileAsync } from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";
import { theme1 } from "../../theme";

export default function ChatRoom() {
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

  const isMobile = window.innerWidth <= 500;
  const chatColor = theme1.palette.chat.main;
  return (
    <Container
      sx={{
        padding: "20px",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          padding: 2,
          backgroundColor: "transparent",
          border: 2,
          borderColor: chatColor,
          height: isMobile ? "500px" : "400px",
          width: "60%",
        }}
      >
        <Typography> {activeTeam?.name} - CHATT</Typography>
      </Card>
    </Container>
  );
}
