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
import { memo, useEffect, useRef, useState } from "react";
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

  const onlineProfiles = useAppSelector(
    (state) => state.profileSlice.onlineProfiles
  );

  const [profilesInRoom, setProfilesInRoom] = useState<ProfileHubDTO[]>([]);
  const [signalRConnected, setSignalRConnected] = useState(false);
  const alreadyFetchedOnlineProfiles = useRef(false);

  const addNewProfilesToRoom = (newProfiles: ProfileHubDTO[]) => {
    setProfilesInRoom((prevProfiles) => {
      const profilesToAdd: ProfileHubDTO[] = [];
      newProfiles.forEach((p) => {
        const profileExistsInRoom = prevProfiles.some(
          (pr) => pr.profileId === p.profileId
        );
        if (!profileExistsInRoom) {
          profilesToAdd.push(p);
        }
      });
      return [...prevProfiles, ...profilesToAdd];
    });
  };

  useEffect(() => {
    console.log("HÄMTAR TEAM");
    dispatch(getActiveTeam());
  }, []);

  useEffect(() => {
    if (activeTeam && !alreadyFetchedOnlineProfiles.current) {
      console.log("HÄMTAR ONLINE");
      dispatch(GetOnlineProfiles(activeTeam?.id));
      alreadyFetchedOnlineProfiles.current = true;
    }
  }, [activeTeam, dispatch]);

  useEffect(() => {
    if (activeTeam) {
      dispatch(GetMyProfileAsync(activeTeam?.id));
      dispatch(GetTeamProfiles(activeTeam?.id));
    }
  }, [activeTeam]);

  useEffect(() => {
    if (onlineProfiles && onlineProfiles.length > 0) {
      addNewProfilesToRoom(onlineProfiles);
    }
  }, [onlineProfiles]);

  useEffect(() => {
    const connection = Connector.getInstance();

    if (!signalRConnected) {
      connection.start().then(() => {
        setSignalRConnected(true);
      });
    }

    connection.events = {
      profileOnline: (profile: ProfileHubDTO) => {
        const profileExistsInRoom = profilesInRoom.some(
          (p) => p.profileId === profile.profileId
        );
        if (!profileExistsInRoom) {
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
  }, [signalRConnected]);

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
        if (
          connection.getConnectionState() ===
          signalR.HubConnectionState.Connected
        ) {
          // Om den är det, skicka begäran om att gå in i mötesrummet
          if (activeProfile) {
            await connection.invokeHubMethod<string>(
              "ProfileEnterMeetingRoom",
              activeProfile.id
            );
            console.log("Profil gick in i mötesrummet");
          }
        } else {
          // Om anslutningen fortfarande inte är i "Connected" -läget, visa ett felmeddelande
          console.error("SignalR connection is not in the 'Connected' state.");
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
        {profilesInRoom && profilesInRoom.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {profilesInRoom.map((profile) => (
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
