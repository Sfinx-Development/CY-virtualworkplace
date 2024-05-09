import { Box, Container } from "@mui/material";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import BackGroundDesign from "../../../components/BackgroundDesign";
import FlexNavcard from "../../../components/FlexNavcard";
import { getActiveProfile } from "../../../slices/profileSlice";
import { useAppDispatch } from "../../../slices/store";
import { getActiveTeam } from "../../../slices/teamSlice";
import { theme1 } from "../../../theme";

export default function Office() {
  const dispatch = useAppDispatch();
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
        height: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          gap: 2,
        }}
      >
        <FlexNavcard
          navigationPage="/office"
          title="Notiser"
          icon={
            <img
              src="      https://i.imgur.com/q8RGT4n.png"
              alt="project management icon"
              style={{ width: 40, height: 40 }}
            />
          }
          backgroundColor={officeColor}
        />

        <FlexNavcard
          navigationPage="information"
          title="Min info"
          icon={
            <img
              src="      https://i.imgur.com/6YGqDBk.png"
              alt="project management icon"
              style={{ width: 40, height: 40 }}
            />
          }
          backgroundColor={officeColor}
        />
      </Box>
      <div style={{ height: "100%", width: "100%" }}>
        <Outlet />
      </div>
    </Container>
  );
}
