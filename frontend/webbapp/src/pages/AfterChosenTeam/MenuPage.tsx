import GroupsIcon from "@mui/icons-material/Groups";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Popper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Team } from "../../../types";
import { GetTeamProfiles } from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { theme1 } from "../../theme";

export default function Menu() {
  const { id } = useParams<{ id: string }>();
  const [profileDropdown, setProfileDropdown] = useState(false);
  const teams = useAppSelector((state) => state.teamSlice.teams);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  // const profiles = useAppSelector((state) => state.profileSlice.profiles);
  const activeTeam: Team | undefined = teams?.find((t) => String(t.id) === id);
  const primaryColor = theme1.palette.primary.main;
  const officeColor = theme1.palette.office.main;
  const meetingRoomColor = theme1.palette.room.main;
  const chatRoomColor = theme1.palette.chat.main;
  const leaveColor = theme1.palette.leave.main;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  //sätta activeteam i reducer? ls? koolla det
  const profiles = useAppSelector((state) => state.profileSlice.profiles);
  useEffect(() => {
    if (id) {
      dispatch(GetTeamProfiles(id));
    }
  }, [id]);

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
        // display: "flex",
        // flexDirection: "column",
        // alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant={isMobile ? "h6" : "h4"}>
          {activeTeam?.name}
        </Typography>
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
              minWidth: isMobile ? "40px" : "300px",
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
                    variant="h5"
                    sx={{ textAlign: "center" }}
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
              minWidth: isMobile ? "40px" : "300px",
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
                    variant="h5"
                    sx={{ textAlign: "center" }}
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
              minWidth: isMobile ? "40px" : "300px",
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
                    variant="h5"
                    sx={{ textAlign: "center" }}
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
              minWidth: isMobile ? "40px" : "300px",
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
                    variant="h5"
                    sx={{ textAlign: "center" }}
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
