import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import PieChartIcon from "@mui/icons-material/PieChart";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import { memo, useEffect, useState } from "react";
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

interface ConnectFormProps {
  connectToVideo: () => void;
}

export const MeetingRoom = ({ connectToVideo }: ConnectFormProps) => {
  const dispatch = useAppDispatch();
  const [connection, setConnection] = useState<Connector>();

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
    if (activeTeam) {
      dispatch(GetTeamProfiles(activeTeam?.id));
      dispatch(GetTeamProjectsAsync(activeTeam.id));
    }
    if (activeTeam && onlineProfiles == undefined) {
      dispatch(GetOnlineProfiles(activeTeam?.id));
    }
  }, [activeTeam]);

  useEffect(() => {
    if (activeProfile) {
      dispatch(GetMyMeetingsAsync(activeProfile.id));
    }
  }, [activeProfile]);

  useEffect(() => {
    dispatch(getActiveTeam());
    dispatch(getActiveProfile());

    const onlineConnection = Connector.getInstance();
    setConnection(onlineConnection);

    onlineConnection.events = {
      profileOnline: (profile: ProfileHubDTO) => {
        dispatch(profileOnline(profile));
      },
      profileOffline: (profileId: string) => {
        dispatch(profileOffline(profileId));
      },
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
  }, [connection]);

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
        minHeight: isMobile ? "100vh" : "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: -1,
      }}
    >
      <BackGroundDesign
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: isMobile ? "100vh" : "100%",
          zIndex: -1,
        }}
        color1={theme1.palette.room.main}
        color2="white"
      />

      <Card
        sx={{
          padding: 2,
          backgroundColor: "#f4f4f4",
          borderRadius: "10px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          width: "90%",
          margin: "0 auto",
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ color: "#333", mb: 2 }}>
            {activeTeam?.name}'s MÖTESRUM
          </Typography>
          {onlineProfiles && onlineProfiles.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {onlineProfiles.map((profile: ProfileHubDTO) => (
                <ProfileItem key={profile.profileId} profile={profile} />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: "#666" }}>
              Ingen profil online
            </Typography>
          )}
        </CardContent>
      </Card>

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
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "center",
          gap: "20px",
          width: "90%",
          mt: 2,
        }}
      >
        <NavCard
          backgroundColor={meetingRoomColor}
          navigationPage="/createMeeting"
          title="Nytt möte"
          icon={
            <img
              src="https://i.imgur.com/HRZXZA9.png"
              alt="project management icon"
              style={{ width: isMobile ? 30 : 40, height: isMobile ? 30 : 40 }}
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

      <Container
        sx={{
          marginTop: isMobile ? 1 : 2,
          display: "flex",
          flexDirection: "column",
          maxHeight: is800Mobile ? "350px" : "300px",
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
