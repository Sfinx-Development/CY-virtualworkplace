import GroupsIcon from "@mui/icons-material/Groups";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Popper,
  Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetTeamProfiles } from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";
import { theme1 } from "../../theme";
import Connector from "./signalRConnection";

export default function Menu() {
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);
  // const primaryColor = theme1.palette.primary.main;
  const officeColor = theme1.palette.office.main;
  const meetingRoomColor = theme1.palette.room.main;
  const chatRoomColor = theme1.palette.chat.main;
  const leaveColor = theme1.palette.leave.main;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const profiles = useAppSelector((state) => state.profileSlice.profiles);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    dispatch(getActiveTeam());
    Connector.getInstance().start();
  }, []);

  useEffect(() => {
    if (activeTeam) {
      dispatch(GetTeamProfiles(activeTeam?.id));
    }
  }, [activeTeam]);

  const copyCodeToClipboard = () => {
    if (activeTeam) {
      navigator.clipboard.writeText(activeTeam.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  //löser inte denna typningen - ska kolla på det - elina hjälp
  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
    setProfileDropdown(true);
  };

  const handleMouseLeave = () => {
    setProfileDropdown(false);
  };
  const backgroundImageUrl = "https://i.imgur.com/bpC29BQ.jpeg";
  const isMobile = window.innerWidth <= 500;
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            {activeTeam?.name}
          </Typography>
          {copied ? (
            <Alert variant="outlined" severity="success">
              Du har kopierat koden!
            </Alert>
          ) : null}

          <Button
            onClick={copyCodeToClipboard}
            variant="contained"
            sx={{ mt: 2 }}
          >
            Kod: {activeTeam?.code}
          </Button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ flexDirection: "column" }}>
          <Card
            sx={{
              display: "flex",
              width: isMobile ? "100px" : "200px",
              marginTop: isMobile ? 10 : 20,
              marginBottom: 4,
              backgroundColor: meetingRoomColor,
            }}
          >
            <CardActionArea
              onClick={() => {
                navigate("/meetingroom");
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Typography
                    component="div"
                    // variant="h5"
                    sx={{
                      textAlign: "center",
                      fontSize: isMobile ? "10" : "22",
                    }}
                  >
                    Mötesrum
                  </Typography>
                </CardContent>
              </Box>
            </CardActionArea>
          </Card>

          <Card
            sx={{
              display: "flex",
              width: isMobile ? "100px" : "200px",
              backgroundColor: chatRoomColor,
            }}
          >
            <CardActionArea
              onClick={() => {
                navigate("/chatroom");
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Typography
                    component="div"
                    // variant="h5"
                    sx={{
                      textAlign: "center",
                      fontSize: isMobile ? "10" : "22",
                    }}
                  >
                    Chattrum
                  </Typography>
                </CardContent>
              </Box>
            </CardActionArea>
          </Card>
        </div>
        <div
          style={{
            flexDirection: "column",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Card sx={{ backgroundColor: "transparent", padding: 1 }}>
            <CardActionArea
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <GroupsIcon sx={{ fontSize: isMobile ? 20 : 40 }} />
            </CardActionArea>

            {profileDropdown && (
              <Popper open={profileDropdown} anchorEl={anchorEl}>
                <Box
                  sx={{
                    border: 1,
                    p: 2,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 2,
                    maxWidth: 300,
                  }}
                >
                  {Array.isArray(profiles) &&
                    profiles.map((profile) => (
                      <Typography key={profile.id} sx={{ marginBottom: 1 }}>
                        {profile.fullName} - {profile.role}
                      </Typography>
                    ))}
                </Box>
              </Popper>
            )}
          </Card>

          <Card
            sx={{
              display: "flex",
              width: isMobile ? "100px" : "200px",
              marginTop: isMobile ? 5 : 15,
              marginBottom: 4,
              backgroundColor: officeColor,
            }}
          >
            <CardActionArea
              onClick={() => {
                navigate("/office");
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Typography
                    component="div"
                    // variant="h5"
                    sx={{
                      textAlign: "center",
                      fontSize: isMobile ? "10" : "22",
                    }}
                  >
                    Mitt Kontor
                  </Typography>
                </CardContent>
              </Box>
            </CardActionArea>
          </Card>
          <Card
            sx={{
              display: "flex",
              width: isMobile ? "100px" : "200px",
              backgroundColor: leaveColor,
            }}
          >
            <CardActionArea
              onClick={() => {
                navigate("/chooseteam");
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Typography
                    component="div"
                    // variant="h5"
                    sx={{
                      textAlign: "center",
                      fontSize: isMobile ? "10" : "22",
                    }}
                  >
                    Lämna
                  </Typography>
                </CardContent>
              </Box>
            </CardActionArea>
          </Card>
        </div>
      </div>
      <a
        style={{
          bottom: 0,
          position: "absolute",
          textDecoration: "none",
          color: "black",
        }}
        href="https://www.vecteezy.com/free-photos/interior"
      >
        Interior Stock photos by Vecteezy
      </a>
    </Container>
  );
}
