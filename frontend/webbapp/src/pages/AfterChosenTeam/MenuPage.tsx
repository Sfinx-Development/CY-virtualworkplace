import GroupsIcon from "@mui/icons-material/Groups";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Popper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../../globalConstants";
import NavCard from "../../components/NavCard";
import { GetMyMeetingsAsync } from "../../slices/meetingSlice";
import {
  GetConversationParticipant,
  GetTeamConversation,
  GetTeamConversationMessages,
} from "../../slices/messageSlice";
import {
  GetOnlineProfiles,
  GetTeamProfiles,
  getActiveProfile,
} from "../../slices/profileSlice";
import { GetTeamProjectsAsync } from "../../slices/projectSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";
import { theme1 } from "../../theme";

export default function Menu() {
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);
  const officeColor = theme1.palette.office.main;
  const meetingRoomColor = theme1.palette.room.main;
  const chatRoomColor = theme1.palette.chat.main;
  // const leaveColor = theme1.palette.leave.main för att lämna/gå ur team?;

  const dispatch = useAppDispatch();
  const activeParticipant = useAppSelector(
    (state) => state.messageSlice.activeConversationParticipant
  );
  const messages = useAppSelector((state) => state.messageSlice.messages);
  const teamConversation = useAppSelector(
    (state) => state.messageSlice.teamConversation
  );
  const profiles = useAppSelector((state) => state.profileSlice.profiles);
  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );
  const [copied, setCopied] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState<number | null>(null);

  const occasions = useAppSelector((state) => state.meetingSlice.occasions);

  const now = new Date();
  const navigate = useNavigate();
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
    dispatch(getActiveProfile());
  }, []);

  useEffect(() => {
    if (activeTeam) {
      dispatch(GetTeamProfiles(activeTeam.id));
      dispatch(GetTeamConversationMessages(activeTeam.id));
      dispatch(GetTeamConversation(activeTeam.id));
      dispatch(GetTeamProjectsAsync(activeTeam.id));
    }
  }, [activeTeam]);

  useEffect(() => {
    if (activeProfile) {
      dispatch(GetMyMeetingsAsync(activeProfile.id));
    }
  }, [activeProfile]);

  useEffect(() => {
    if (teamConversation && activeProfile) {
      dispatch(
        GetConversationParticipant({
          profileId: activeProfile.id,
          conversationId: teamConversation.id,
        })
      );
    }
  }, [teamConversation]);

  useEffect(() => {
    if (activeParticipant && messages) {
      const unreadMessages = messages.filter((message) => {
        return (
          new Date(message.dateCreated) > new Date(activeParticipant.lastActive)
        );
      });
      setUnreadMessages(unreadMessages.length);
    }
  }, [activeParticipant]);

  const copyCodeToClipboard = () => {
    if (activeTeam) {
      navigator.clipboard.writeText(activeTeam.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
    setProfileDropdown(true);
  };

  const handleNavigationToMeetingRoom = () => {
    if (activeTeam) {
      dispatch(GetOnlineProfiles(activeTeam.id));
      navigate("/meetingroom");
    }
  };
  const handleMouseLeave = () => {
    setProfileDropdown(false);
  };

  const handleNavigateToCalendar = () => {
    if (activeTeam) {
      dispatch(GetOnlineProfiles(activeTeam.id));
      navigate("/meetingroom");
    }
    navigate("/calendar");
  };

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundPosition: "center",
        minHeight: "100%",
        position: "relative",
      }}
    >
      {/* <BackGroundDesignNoAnimation
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: -1,
        }}
        color1={"black"}
        color2="black"
        waveColor={"rgba(255, 107, 107,0.4)"}
      /> */}
      <Container sx={{ marginTop: "20px", marginBottom: "20px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <div>
            <NavCard
              navigationPage="/calendar"
              onClick={handleNavigateToCalendar}
              imageUrl="https://i.imgur.com/V05Tc5r.png"
              title="Kalender"
            />
          </div>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              mt: { xs: 2, md: 0 },
            }}
          >
            <Typography variant={isMobile ? "h5" : "h4"}>
              {activeTeam?.name}
            </Typography>
            <Button
              onClick={copyCodeToClipboard}
              variant="contained"
              sx={{ mt: 2 }}
            >
              Kopiera kod: {activeTeam?.code}
            </Button>
            {copied && !isMobile ? (
              <Alert
                variant="outlined"
                severity="success"
                sx={{ position: "absolute", marginTop: isMobile ? 20 : 15 }}
              >
                Du har kopierat koden!
              </Alert>
            ) : null}
          </Box>
          <Box
            component="div"
            sx={{
              backgroundColor: "transparent",
              paddingX: "50px",
              maxHeight: 40,
              mx: 2,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <GroupsIcon sx={{ fontSize: isMobile ? 30 : 50 }} />
          </Box>

          {profileDropdown && (
            <Popper
              open={profileDropdown}
              anchorEl={anchorEl}
              onMouseLeave={handleMouseLeave}
            >
              <Card
                sx={{
                  p: 2,
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
              </Card>
            </Popper>
          )}
        </Box>
      </Container>
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            gap: { xs: 3, md: 6 },
            marginTop: "20px",
          }}
        >
          <NavCard
            backgroundColor={meetingRoomColor}
            navigationPage="/meetingroom"
            title="Mötesrum"
            onClick={handleNavigationToMeetingRoom}
            icon={
              ongoingMeeting ? (
                <NotificationsNoneIcon
                  sx={{
                    paddingLeft: 1,
                    flexDirection: "row",
                    fontSize: isMobile ? "1rem" : "22px",
                  }}
                />
              ) : null
            }
          />

          <NavCard
            backgroundColor={chatRoomColor}
            navigationPage="/chatroom"
            title="Chatt"
            icon={
              unreadMessages != null && unreadMessages > 0 ? (
                <MarkUnreadChatAltIcon
                  sx={{
                    paddingLeft: 1,
                    flexDirection: "row",
                    fontSize: isMobile ? "1rem" : "22px",
                  }}
                />
              ) : null
            }
          />

          <NavCard
            backgroundColor={officeColor}
            navigationPage="/office"
            title="Min sida"
          />
        </Box>
      </Container>
    </Box>
  );
}
