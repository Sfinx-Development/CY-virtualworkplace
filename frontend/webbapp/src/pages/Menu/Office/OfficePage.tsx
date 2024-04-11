import MailOutlineIcon from "@mui/icons-material/MailOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Card, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import BackGroundDesign from "../../../components/BackgroundDesign";
import FlexNavcard from "../../../components/FlexNavcard";
import { getActiveProfile } from "../../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../../slices/store";
import { getActiveTeam } from "../../../slices/teamSlice";
import { theme1 } from "../../../theme";

export default function Office() {
  const dispatch = useAppDispatch();
  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );

  useEffect(() => {
    dispatch(getActiveTeam());
    dispatch(getActiveProfile());
  }, []);

  const officeColor = theme1.palette.office.main;

  return (
    <Container
      sx={{
        padding: "20px",
        backgroundPosition: "center",
        minHeight: "100%",
      }}
    >
      <BackGroundDesign
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
        color1={theme1.palette.office.main}
        color2="white"
      />
      <Card
        sx={{
          display: "flex",
          padding: 2,
          backgroundColor: officeColor,
          width: "100%",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography> {activeProfile?.fullName.toUpperCase()}'S SIDA</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            gap: 2,
          }}
        >
          <FlexNavcard
            navigationPage="notifications"
            title="Notiser"
            icon={<MailOutlineIcon />}
          />
          <FlexNavcard
            navigationPage="information"
            title="Min info"
            icon={<SettingsIcon />}
          />
        </Box>
      </Card>
      <Outlet />
    </Container>
  );
}
