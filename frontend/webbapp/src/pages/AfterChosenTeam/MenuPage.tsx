import GroupsIcon from "@mui/icons-material/Groups";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
  Avatar,
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
import { GetMyMeetingsAsync } from "../../slices/meetingSlice";
import { GetMyProfileAsync, GetTeamProfiles } from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";
import { theme1 } from "../../theme";
import ChatConnector from "./ChatConnection";
import Connector from "./OnlineConnection";

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
  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );
  const [copied, setCopied] = useState(false);

  const occasions = useAppSelector((state) => state.meetingSlice.occasions);
  const now = new Date();

  const ongoingMeeting = occasions
    ? occasions.find((occasion) => {
        const startDate = new Date(occasion.date);
        const endDate = new Date(
          startDate.getTime() + occasion.minutes * 60000
        );
        return startDate <= now && endDate >= now;
      })
    : null;

  useEffect(() => {
    dispatch(getActiveTeam());
    Connector.getInstance().start();
    ChatConnector.getInstance().start();
  }, []);

  //räcker att man köra getmyprofile här och sedan överallt framåt - getactiveprofile för här sätts till localstorage
  useEffect(() => {
    if (activeTeam) {
      dispatch(GetTeamProfiles(activeTeam.id));
      dispatch(GetMyProfileAsync(activeTeam.id));
    }
  }, []);

  useEffect(() => {
    if (activeProfile) {
      console.log("körs");
      console.log("AKTIVE PROFIL : ", activeProfile);
      dispatch(GetMyMeetingsAsync(activeProfile.id));
    }
  }, []);

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
                <CardContent
                  sx={{
                    display: "flex",
                    flex: "1 0 auto",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
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
                  {ongoingMeeting ? (
                    <NotificationsNoneIcon
                      sx={{
                        paddingLeft: 1,
                        textAlign: "center",
                        flexDirection: "row",
                        fontSize: isMobile ? "10" : "22",
                      }}
                    />
                  ) : null}
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
              <Popper
                open={profileDropdown}
                anchorEl={anchorEl}
                onMouseLeave={handleMouseLeave}
              >
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
                      <Typography
                        key={profile.id}
                        sx={{
                          marginBottom: 1,
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Avatar
                          src={profile.avatarUrl}
                          sx={{ height: 25, width: 20, marginRight: 1 }}
                        />
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
