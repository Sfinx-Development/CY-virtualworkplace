import * as signalR from "@microsoft/signalr";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileHubDTO } from "../../../types";
import {
  GetMyProfileAsync,
  GetOnlineProfiles,
  GetTeamProfiles,
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
  const [loadedOnlineProfiles, setLoadedOnlineProfiles] = useState(false);
  const onlineProfiles = useAppSelector(
    (state) => state.profileSlice.onlineProfiles
  );

  const [profilesInRoom, setProfilesInRoom] = useState<ProfileHubDTO[]>([]);

  const addNewProfilesToRoom = (newProfiles: ProfileHubDTO[]) => {
    setProfilesInRoom((prevProfiles) => {
      const profilesToSetInRoom: ProfileHubDTO[] = [];
      newProfiles.forEach((p) => {
        const profileExistsInRoom = prevProfiles.some(
          (pr) => pr.profileId === p.profileId
        );
        if (!profileExistsInRoom) {
          profilesToSetInRoom.push(p);
        }
      });
      return [...prevProfiles, ...profilesToSetInRoom];
    });
  };

  useEffect(() => {
    dispatch(getActiveTeam());
  }, [dispatch]);

  useEffect(() => {
    if (activeTeam && !loadedOnlineProfiles) {
      dispatch(GetMyProfileAsync(activeTeam?.id));
      dispatch(GetTeamProfiles(activeTeam?.id));
      dispatch(GetOnlineProfiles(activeTeam?.id));
    }
  }, [dispatch, activeTeam, loadedOnlineProfiles]);

  useEffect(() => {
    if (onlineProfiles && onlineProfiles.length > 0) {
      setLoadedOnlineProfiles(true);
      addNewProfilesToRoom(onlineProfiles);
    }
  }, [onlineProfiles]);

  useEffect(() => {
    const connection = Connector.getInstance();

    connection.events = {
      profileOnline: (profile: ProfileHubDTO) => {
        if (!profilesInRoom.some((p) => p.profileId == profile.profileId)) {
          setProfilesInRoom((prevProfiles) => [...prevProfiles, profile]);
        }
      },
      profileOffline: (profileId: string) => {
        setProfilesInRoom((prevProfiles) =>
          prevProfiles.filter((p) => p.profileId !== profileId)
        );
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
    const enterMeetingRoom = async () => {
      const connection = Connector.getInstance();
      try {
        if (
          connection.getConnectionState() !==
          signalR.HubConnectionState.Connected
        ) {
          await connection.start();
        }
        if (activeProfile) {
          await connection.invokeHubMethod<string>(
            "ProfileEnterMeetingRoom",
            activeProfile.id
          );
          console.log("Profil gick in i mötesrummet");
        }
      } catch (error) {
        console.error("Error sending enter meeting room request:", error);
      }
    };

    const leaveMeetingRoom = async () => {
      if (activeProfile) {
        const connection = Connector.getInstance();
        if (
          connection.getConnectionState() ===
          signalR.HubConnectionState.Disconnected
        ) {
          try {
            await connection.start();
          } catch (error) {
            console.error("Error starting connection:", error);
            return;
          }
        }

        try {
          connection.invokeHubMethod<string>(
            "ProfileLeavingMeetingRoom",
            activeProfile.id
          );
        } catch (error) {
          console.error("Error invoking hub method:", error);
        }
      }
    };

    enterMeetingRoom();

    return () => {
      leaveMeetingRoom();
    };
  }, [activeProfile]);

  const backgroundImageUrl = "https://i.imgur.com/EC5f1XS.jpeg";
  const isMobile = window.innerWidth <= 500;
  const meetingRoomColor = theme1.palette.room.main;
  const leaveColor = theme1.palette.leave.main;
  const navigate = useNavigate();
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
        {profilesInRoom && profilesInRoom.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              // alignItems: "center",
            }}
          >
            {profilesInRoom.map((profile) => (
              <div
                key={profile.profileId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <FiberManualRecordIcon sx={{ color: "lightgreen" }} />
                <Typography key={profile.profileId}>
                  {profile.fullName}
                </Typography>
              </div>
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
                  Skapa möte i teamet
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
