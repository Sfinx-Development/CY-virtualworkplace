import GroupsIcon from "@mui/icons-material/Groups";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Popper,
  Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../../globalConstants";
import NavCard from "../../components/NavCard";
import {
  GetConversationParticipant,
  GetTeamConversation,
} from "../../slices/conversationSlice";
import { GetMyMeetingsAsync } from "../../slices/meetingSlice";
import { GetTeamConversationMessages } from "../../slices/messageSlice";
import {
  GetMyProfileAsync,
  GetOnlineProfiles,
  GetTeamProfiles,
} from "../../slices/profileSlice";
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
  }, []);

  useEffect(() => {
    if (activeTeam) {
      dispatch(GetTeamProfiles(activeTeam.id));
      dispatch(GetMyProfileAsync(activeTeam.id));
    }
  }, []);

  useEffect(() => {
    if (activeProfile) {
      dispatch(GetMyMeetingsAsync(activeProfile.id));
      dispatch(GetTeamConversation(activeProfile.id));
      dispatch(GetTeamConversationMessages(activeProfile.id));
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
    if (activeParticipant) {
      const unreadMessages = messages.filter((message) => {
        return (
          new Date(message.dateCreated) >
          new Date(activeParticipant?.lastActive)
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

  //löser inte denna typningen - ska kolla på det - elina hjälp
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
  const backgroundImageUrl = "https://i.imgur.com/bpC29BQ.jpeg";

  return (
    <Container
      sx={{
        padding: "20px",
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
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
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <div className="company-name-container">
              <Typography
                variant="h4"
                className="company-name"
                sx={{ textAlign: "center" }}
              >
                {activeTeam?.name}
              </Typography>
            </div>
          </Box>
          <Button
            onClick={copyCodeToClipboard}
            variant="contained"
            sx={{ mt: 2 }}
          >
            Kod: {activeTeam?.code}
          </Button>
          {copied ? (
            <Alert
              variant="filled"
              severity="success"
              sx={{ position: "absolute", marginTop: isMobile ? 20 : 15 }}
            >
              Du har kopierat koden!
            </Alert>
          ) : null}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 100,
          height: "100%",
        }}
      >
        <div
          style={{
            flexDirection: "column",
            display: "flex",
            gap: 50,
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
                    textAlign: "center",
                    flexDirection: "row",
                    fontSize: isMobile ? "10" : "22",
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
                    textAlign: "center",
                    flexDirection: "row",
                    fontSize: isMobile ? "10" : "22",
                  }}
                />
              ) : null
            }
          />
        </div>

        <Card sx={{ backgroundColor: "transparent", padding: 1 }}>
          <Box
            component="div"
            sx={{ backgroundColor: "transparent", padding: 1 }}
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
        </Card>
        <div
          style={{
            flexDirection: "column",
            display: "flex",
            gap: 50,
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
