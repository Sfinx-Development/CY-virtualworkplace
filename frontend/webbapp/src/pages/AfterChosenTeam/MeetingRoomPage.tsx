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
import { is800Mobile, isMobile } from "../../../globalConstants";
import { MeetingOccasionNoDate, ProfileHubDTO } from "../../../types";
import BackGroundDesign from "../../components/BackgroundDesign";
import NavCard from "../../components/NavCard";
import ProgressBar from "../../components/ProgressBar";
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
import { GetTeamProjectsAsync } from "../../slices/projectSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";
import { theme1 } from "../../theme";
import Connector from "./OnlineConnection";
import PieChartIcon from "@mui/icons-material/PieChart";

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
  const projects = useAppSelector((state) => state.projectSlice.projects);

  const ongoingMeeting = occasions
    ? occasions.find((occasion: MeetingOccasionNoDate) => {
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
      dispatch(GetTeamProjectsAsync(activeTeam.id));
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

  const meetingRoomColor = theme1.palette.room.main;
  const leaveColor = theme1.palette.leave.main;

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
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center", // Centrera innehållet horisontellt
      }}
    >
      {/* Bakgrund */}
      <BackGroundDesign
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
        color1={theme1.palette.room.main}
        color2="white"
      />

      {/* Mötesrumskort */}
      <Card sx={{ padding: 2, backgroundColor: "white", width: "90%" }}>
        <CardContent>
          <Typography variant="h6">{activeTeam?.name}'s mötesrum</Typography>
          {onlineProfiles && onlineProfiles.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
              {onlineProfiles.map((profile: ProfileHubDTO) => (
                <ProfileItem key={profile.profileId} profile={profile} />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" mt={2}>
              Inga profiler online
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Pågående möte */}
      {ongoingMeeting && (
        <Card sx={{ my: 2 }}>
          <CardActionArea
            onClick={() => {
              dispatch(setActiveMeeting(ongoingMeeting.meetingId));
              connectToVideo();
            }}
          >
            <CardContent>
              <Typography variant="h6" align="center">
                Gå med i mötet {ongoingMeeting.name}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      )}

      {/* Navigation */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center", // Centrera navigationskorten
          gap: "20px",
          mt: 2,
        }}
      >
        {/* Navigationskort */}
        <NavCard
          backgroundColor={meetingRoomColor}
          navigationPage="/createMeeting"
          title="Nytt möte"
          icon={
            <img
              src="https://i.imgur.com/HRZXZA9.png"
              alt="project management icon"
              style={{ width: 40, height: 40 }}
            />
          }
        />

        <NavCard
          backgroundColor={meetingRoomColor}
          navigationPage="/meetinginteam"
          title="Alla möten"
          icon={
            <img
              src="https://i.imgur.com/HeztEpU.png"
              alt="project management icon"
              style={{ width: 40, height: 40 }}
            />
          }
        />

        <NavCard
          backgroundColor={meetingRoomColor}
          navigationPage="/createproject"
          title="Nytt projekt"
          icon={
            <img
              src="https://i.imgur.com/GvdAMWN.png"
              alt="project management icon"
              style={{ width: 40, height: 40 }}
            />
          }
        />
        <NavCard
          backgroundColor={meetingRoomColor}
          navigationPage="/healthcheck"
          title="Statistik"
          icon={<PieChartIcon sx={{ fontSize: isMobile ? 30 : 40 }} />}
        />
        <NavCard
          backgroundColor={leaveColor}
          navigationPage="/menu"
          title="Lämna"
        />
      </Box>

      {/* Projektlista */}
      <Container
        sx={{
          marginTop: isMobile ? 1 : 2,
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
    </Container>
  );
};
