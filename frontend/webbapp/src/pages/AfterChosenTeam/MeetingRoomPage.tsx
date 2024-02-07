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
import { GetMyProfileAsync, GetTeamProfiles } from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";
import { theme1 } from "../../theme";
import Connector from "./signalRConnection";
import * as signalR from "@microsoft/signalr";

export default function MeetingRoom() {
  const dispatch = useAppDispatch();

  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);
  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );

  const [profilesInRoom, setProfilesInRoom] = useState<string[]>([]);

  useEffect(() => {
    dispatch(getActiveTeam());
  }, [dispatch]);

  useEffect(() => {
    if (activeTeam) {
      dispatch(GetMyProfileAsync(activeTeam?.id));
      dispatch(GetTeamProfiles(activeTeam?.id));
    }
  }, [dispatch, activeTeam]);

  useEffect(() => {
    const connection = Connector.getInstance();

    // Prenumerera på händelser
    connection.events = {
      profileOnline: (profileId: string) => {
        setProfilesInRoom((prevProfiles) => [...prevProfiles, profileId]);
      },
      profileOffline: (profileId: string) => {
        setProfilesInRoom((prevProfiles) =>
          prevProfiles.filter((id) => id !== profileId)
        );
      },
    };

    // Komponentrensning
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
          // Starta anslutningen om den inte redan är igång
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

    // Komponentrensning
    return () => {
      leaveMeetingRoom();
    };
  }, [activeProfile]);

  const backgroundImageUrl = "https://i.imgur.com/EC5f1XS.jpeg";
  const isMobile = window.innerWidth <= 500;
  // const isMobile = window.innerWidth <= 500;
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
        <Typography>{profilesInRoom ? profilesInRoom : "ingen"}</Typography>
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
