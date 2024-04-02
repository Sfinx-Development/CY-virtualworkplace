import GroupsIcon from "@mui/icons-material/Groups";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Popper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { is800Mobile, isMobile } from "../../../globalConstants";
import NavCard from "../../components/NavCard";
import ProgressBar from "../../components/ProgressBar";
import {
  GetConversationParticipant,
  GetTeamConversation,
} from "../../slices/conversationSlice";
import { GetMyMeetingsAsync } from "../../slices/meetingSlice";
import { GetTeamConversationMessages } from "../../slices/messageSlice";
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
  const leaveColor = theme1.palette.leave.main;

  const dispatch = useAppDispatch();
  const activeParticipant = useAppSelector(
    (state) => state.conversationSlice.activeConversationParticipant
  );
  const messages = useAppSelector((state) => state.messageSlice.messages);
  const teamConversation = useAppSelector(
    (state) => state.conversationSlice.teamConversation
  );
  const profiles = useAppSelector((state) => state.profileSlice.profiles);
  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );
  const [copied, setCopied] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState<number | null>(null);

  const occasions = useAppSelector((state) => state.meetingSlice.occasions);
  const projects = useAppSelector((state) => state.projectSlice.projects);
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
  const backgroundImageUrl = "https://i.imgur.com/qwzB7Zi.jpeg";

  const handleNavigateToCalendar = () => {
    if (activeTeam) {
      dispatch(GetOnlineProfiles(activeTeam.id));
      navigate("/meetingroom");
    }
    navigate("/calendar");
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <NavCard
          navigationPage="/calendar"
          onClick={handleNavigateToCalendar}
          imageUrl="https://i.imgur.com/V05Tc5r.png"
        />
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
            Kod: {activeTeam?.code}
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
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          mt: { xs: 4, md: 8 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 3, md: 6 },
            mb: { xs: 3, md: 0 },
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
            title="Chattrum"
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
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 3, md: 6 },
          }}
        >
          <NavCard
            backgroundColor={officeColor}
            navigationPage="/office"
            title="Mitt Kontor"
          />

          <NavCard
            backgroundColor={leaveColor}
            navigationPage="/chooseteam"
            title="Lämna"
          />
        </Box>
      </Box>

      <Container
        sx={{
          marginTop: isMobile ? 5 : 15,
          display: "flex",
          flexDirection: "column",
          height: is800Mobile ? "350px" : "300px",
          flexGrow: 1,
          overflow: "auto",
          width: "100%",
        }}
        className="project-list-container"
      >
        {projects ? (
          <Box>
            {projects.map((p) => (
              <ProgressBar project={p} key={p.id} />
            ))}
          </Box>
        ) : null}
      </Container>

      <Typography
        component="a"
        href="https://www.freepik.com/"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          bottom: 0,
          textDecoration: "none",
          color: "black",
        }}
      >
        Designed by Freepik
      </Typography>
    </div>
  );
}
