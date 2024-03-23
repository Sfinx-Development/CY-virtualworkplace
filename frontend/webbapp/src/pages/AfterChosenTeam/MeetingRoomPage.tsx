import AddIcon from "@mui/icons-material/Add";
import EventNoteIcon from "@mui/icons-material/EventNote";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import { memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../../globalConstants";
import { MeetingOccasion, ProfileHubDTO } from "../../../types";
import {
  GetMyMeetingsAsync,
  setActiveMeeting,
} from "../../slices/meetingSlice";
import {
  GetOnlineProfiles,
  GetTeamProfiles,
  enterMeetingRoomAsync,
  getActiveProfile,
  leaveMeetingRoomAsync,
  profileOffline,
  profileOnline,
} from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";
import { theme1 } from "../../theme";
import Connector from "./OnlineConnection";

interface ConnectFormProps {
  connectToVideo: () => void;
}

export const MeetingRoom = ({ connectToVideo }: ConnectFormProps) => {
  const dispatch = useAppDispatch();

  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);
  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );
  const onlineProfiles = useAppSelector(
    (state) => state.profileSlice.onlineProfiles
  );

  const occasions = useAppSelector((state) => state.meetingSlice.occasions);
  const now = new Date();

  const ongoingMeeting = occasions
    ? occasions.find((occasion: MeetingOccasion) => {
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
      // dispatch(GetMyProfileAsync(activeTeam?.id));
      dispatch(GetTeamProfiles(activeTeam?.id));
      dispatch(GetOnlineProfiles(activeTeam.id));
    }
  }, [activeTeam]);

  useEffect(() => {
    if (activeProfile) {
      dispatch(GetMyMeetingsAsync(activeProfile.id));
    }
  }, []);

  useEffect(() => {
    const connection = Connector.getInstance();

    connection.events = {
      profileOnline: (profile: ProfileHubDTO) => {
        dispatch(profileOnline(profile));
      },
      profileOffline: (profileId: string) => {
        dispatch(profileOffline(profileId));
      },
    };

    return () => {
      if (connection) {
        Connector.getInstance().events = {
          profileOnline: () => {},
          profileOffline: () => {},
        };
      }
    };
  }, []);

  useEffect(() => {
    if (activeProfile) {
      dispatch(enterMeetingRoomAsync(activeProfile.id));
    }

    return () => {
      if (activeProfile) {
        dispatch(leaveMeetingRoomAsync(activeProfile.id));
      }
    };
  }, [dispatch, activeProfile]);

  const backgroundImageUrl = "https://i.imgur.com/EC5f1XS.jpeg";
  const meetingRoomColor = theme1.palette.room.main;
  const leaveColor = theme1.palette.leave.main;
  const navigate = useNavigate();

  const ProfileItem = memo(({ profile }: { profile: ProfileHubDTO }) => (
    <div
      key={profile.profileId}
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "5px",
      }}
    >
      <FiberManualRecordIcon sx={{ color: "lightgreen" }} />
      <Typography>{profile.fullName}</Typography>
    </div>
  ));

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
      <Card
        sx={{
          padding: 2,
          backgroundColor: meetingRoomColor,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {" "}
        <Typography> {activeTeam?.name}'s mötesrum</Typography>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            {onlineProfiles && onlineProfiles.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {onlineProfiles.map((profile: ProfileHubDTO) => (
                  <ProfileItem key={profile.profileId} profile={profile} />
                ))}
              </div>
            ) : (
              <Typography>Inga profiler online</Typography>
            )}
          </Box>

          <div
            onClick={() => {
              navigate("/healthcheck");
            }}
            style={{ cursor: "pointer" }}
          >
            <Box>
              <MonitorHeartIcon sx={{ fontSize: 40 }} />
            </Box>
          </div>
        </div>
      </Card>
      {ongoingMeeting ? (
        <Card
          sx={{
            display: "inline-block",
            width: "300px",
            margin: "10px",
            backgroundColor: meetingRoomColor,
          }}
        >
          <CardActionArea
            onClick={() => {
              dispatch(setActiveMeeting(ongoingMeeting.meetingId));
              connectToVideo();
            }}
          >
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography
                component="div"
                variant="h6"
                sx={{ textAlign: "center" }}
              >
                Gå med i mötet {ongoingMeeting.name}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ) : null}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          flexDirection: "column",
          marginTop: 10,
          gap: 10,
        }}
      >
        <Card
          sx={{
            display: "flex",
            minWidth: isMobile ? "170px" : "200px",
            backgroundColor: meetingRoomColor,
          }}
        >
          <CardActionArea
            onClick={() => {
              navigate("/createmeeting");
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent
                sx={{
                  flex: "1 0 auto",
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <AddIcon
                  sx={{
                    textAlign: "center",
                    fontSize: isMobile ? "10" : "22",
                    marginRight: 0.5,
                  }}
                />
                <Typography
                  component="div"
                  sx={{ textAlign: "center", fontSize: isMobile ? "10" : "22" }}
                >
                  Skapa möte
                </Typography>
              </CardContent>
            </Box>
          </CardActionArea>
        </Card>

        <Card
          sx={{
            display: "flex",
            minWidth: isMobile ? "170px" : "200px",
            backgroundColor: meetingRoomColor,
          }}
        >
          <CardActionArea
            onClick={() => {
              navigate("/meetinginteam");
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent
                sx={{
                  flex: "1 0 auto",
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <EventNoteIcon
                  sx={{
                    textAlign: "center",
                    fontSize: isMobile ? "10" : "22",
                    marginRight: 0.5,
                  }}
                />
                <Typography
                  component="div"
                  sx={{ textAlign: "center", fontSize: isMobile ? "10" : "22" }}
                >
                  Teamets möten
                </Typography>
              </CardContent>
            </Box>
          </CardActionArea>
        </Card>

        <Card
          sx={{
            display: "flex",
            minWidth: isMobile ? "170px" : "200px",
            backgroundColor: leaveColor,
          }}
        >
          <CardActionArea
            onClick={() => {
              navigate("/menu");
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography
                  component="div"
                  sx={{ textAlign: "center", fontSize: isMobile ? "10" : "22" }}
                >
                  Lämna
                </Typography>
              </CardContent>
            </Box>
          </CardActionArea>
        </Card>
      </div>
    </Container>
  );
};
