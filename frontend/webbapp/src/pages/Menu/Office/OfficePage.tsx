import { Avatar, Box, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { isMobile } from "../../../../globalConstants";
import FlexNavcard from "../../../components/FlexNavcard";
import { getActiveProfile } from "../../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../../slices/store";
import { getActiveTeam } from "../../../slices/teamSlice";
import SettingsIcon from "@mui/icons-material/Settings";

export default function Office() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getActiveTeam());
    dispatch(getActiveProfile());
  }, []);

  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);
  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        backgroundImage:
          "linear-gradient(315deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.9) 74%)",
        color: "#FFF",
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: isMobile ? "20px" : "40px",
          margin: 0,
          width: "100%",
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
            padding: "20px 0",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Min sida på {activeTeam?.name}
          </Typography>
          <Avatar
            alt="profile image"
            src={activeProfile?.avatarUrl}
            sx={{ height: 50, width: 50 }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "center",
            width: "100%",
            gap: isMobile ? 2 : 4,
          }}
        >
          <FlexNavcard
            navigationPage="/office"
            title="Notiser"
            icon={
              <img
                src="https://i.imgur.com/q8RGT4n.png"
                alt="notification icon"
                style={{ width: 40, height: 40 }}
              />
            }
            backgroundColor="#fbe3b4"
          />

          <FlexNavcard
            navigationPage="information"
            title="Min info"
            icon={
              // <img
              //   src="https://i.imgur.com/6YGqDBk.png"
              //   alt="information icon"
              //   style={{ width: 40, height: 40 }}
              // />
              <SettingsIcon />
            }
            backgroundColor="#fbe3b4"
          />
        </Box>

        <Outlet />
      </Container>
    </Box>
  );
}
