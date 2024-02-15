import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
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
import { ProfileHubDTO } from "../../../types";
import {
  GetMyProfileAsync,
  GetOnlineProfiles,
  GetTeamProfiles,
  enterMeetingRoomAsync,
  leaveMeetingRoomAsync,
  profileOffline,
  profileOnline,
} from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";
import { theme1 } from "../../theme";
import Connector from "./signalRConnection";

export default function MeetingRoom() {
  const dispatch = useAppDispatch();

  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);
  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );
  const onlineProfiles = useAppSelector(
    (state) => state.profileSlice.onlineProfiles
  );

  useEffect(() => {
    console.log("HÄMTAR TEAM");
    dispatch(getActiveTeam());
  }, []);

  useEffect(() => {
    if (activeTeam) {
      dispatch(GetMyProfileAsync(activeTeam?.id));
      dispatch(GetTeamProfiles(activeTeam?.id));
      dispatch(GetOnlineProfiles(activeTeam.id));
    }
  }, [activeTeam]);

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
    // När komponenten monteras, skicka en åtgärd för att gå in i mötesrummet
    if (activeProfile) {
      dispatch(enterMeetingRoomAsync(activeProfile.id));
    }

    // När komponenten avmonteras, skicka en åtgärd för att lämna mötesrummet
    return () => {
      if (activeProfile) {
        dispatch(leaveMeetingRoomAsync(activeProfile.id));
      }
    };
  }, [dispatch, activeProfile]);

  const backgroundImageUrl = "https://i.imgur.com/EC5f1XS.jpeg";
  const isMobile = window.innerWidth <= 500;
  const meetingRoomColor = theme1.palette.room.main;
  const leaveColor = theme1.palette.leave.main;
  const navigate = useNavigate();

  const ProfileItem = memo(({ profile }: { profile: ProfileHubDTO }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "5px",
      }}
    >
      <FiberManualRecordIcon sx={{ color: "lightgreen" }} />
      <Typography key={profile.profileId}>{profile.fullName}</Typography>
    </div>
  ));

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
      <Card sx={{ padding: 2, backgroundColor: meetingRoomColor }}>
        <Typography> {activeTeam?.name}'s mötesrum</Typography>
        {onlineProfiles && onlineProfiles.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {onlineProfiles.map((profile) => (
              <ProfileItem key={profile.profileId} profile={profile} />
            ))}
          </div>
        ) : (
          <Typography>Inga profiler online</Typography>
        )}
      </Card>
      <div
        style={{
          display: "flex",
          height: "80%",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <Card
          sx={{
            display: "flex",
            minWidth: isMobile ? "100px" : "250px",
            backgroundColor: meetingRoomColor,
          }}
        >
          <CardActionArea
            onClick={() => {
              navigate("/createmeeting");
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography
                  component="div"
                  variant="h6"
                  sx={{ textAlign: "center" }}
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
            minWidth: isMobile ? "100px" : "250px",
            backgroundColor: meetingRoomColor,
          }}
        >
          <CardActionArea
            onClick={() => {
              navigate("/meetinginteam");
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography
                  component="div"
                  variant="h6"
                  sx={{ textAlign: "center" }}
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
            minWidth: isMobile ? "100px" : "250px",
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
                  variant="h6"
                  sx={{ textAlign: "center" }}
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
}
