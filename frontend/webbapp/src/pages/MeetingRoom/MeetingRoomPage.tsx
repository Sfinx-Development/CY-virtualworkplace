import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { isMobile } from "../../../globalConstants";
import { MeetingOccasionNoDate, ProfileHubDTO } from "../../../types";
import FlexNavcard from "../../components/FlexNavcard";
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
import Connector from "../AfterChosenTeam/OnlineConnection";

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

  const menuChoices: [string, string][] = [
    ["Alla möten", "meetinginteam"],
    ["Nytt möte", "createmeeting"],
    ["Alla projekt", ""],
    ["Nytt projekt", "createproject"],
    ["Statistik", "healthcheck"],
    ["Inställningar", "settings"],
  ];
  const [activeMenuChoice, setActiveMenuChoice] = useState("Alla projekt");
  const occasions = useAppSelector((state) => state.meetingSlice.occasions);
  const now = new Date();
  const navigate = useNavigate();

  const [showMeetingDropdown, setShowMeetingDropdown] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const handleMeetingDropdownToggle = () => {
    setShowMeetingDropdown(!showMeetingDropdown);
  };

  const handleProjectDropdownToggle = () => {
    setShowProjectDropdown(!showProjectDropdown);
  };
  const handleDropdownOptionClick = (option: string) => {
    setShowMeetingDropdown(false);
    setShowProjectDropdown(false);
    navigate(option);
  };
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
    if (activeTeam) {
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

  const getTupleFromValue = (value: string): [string, string] | undefined => {
    return menuChoices.find((tuple) => tuple[0] === value);
  };

  const handleMenuChoice = (selectedMenuChoice: string) => {
    if (selectedMenuChoice) {
      setActiveMenuChoice(selectedMenuChoice);
      const path = getTupleFromValue(selectedMenuChoice);
      if (path != undefined) {
        navigate(`${path[1]}`);
      }
    }
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        backgroundImage:
          "linear-gradient(315deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.9) 74%)",
        margin: 0,
        flex: 1,
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* <BackGroundDesign
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: isMobile ? "100vh" : "100%",
          zIndex: -1,
        }}
        color1={theme1.palette.room.main}
        color2="white"
      /> */}

      {isMobile ? (
        <FormControl fullWidth>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={activeMenuChoice ?? "Alla projekt"}
            onChange={(event) => handleMenuChoice(event.target.value)}
          >
            {menuChoices.map((m, index) => (
              <MenuItem key={index} value={m[0]}>
                {m[0]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
            gap: 2,
            marginRight: 4,
            marginLeft: 4,
            position: "relative",
            mt: isMobile ? 0 : 2,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              position: "relative",
            }}
          >
            <FlexNavcard
              backgroundColor={meetingRoomColor}
              title="Möten"
              icon={
                <img
                  src="https://i.imgur.com/HRZXZA9.png"
                  alt="project management icon"
                  style={{
                    maxWidth: isMobile ? 30 : 40,
                    height: isMobile ? 30 : 40,
                  }}
                />
              }
              onClick={handleMeetingDropdownToggle}
            />
            {showMeetingDropdown && (
              <div
                className="dropdown-menu"
                style={{
                  position: "absolute",
                  top: "100%",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  zIndex: 999,
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => handleDropdownOptionClick("createmeeting")}
                  sx={{ color: "black", backgroundColor: "#F8F8F8" }}
                >
                  Nytt möte
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleDropdownOptionClick("meetinginteam")}
                  sx={{ color: "black", backgroundColor: "#F8F8F8" }}
                >
                  Alla möten
                </Button>
              </div>
            )}
          </div>
          {ongoingMeeting && (
            <Card sx={{ py: 2, backgroundColor: "lightgreen" }}>
              <CardActionArea
                onClick={() => {
                  dispatch(setActiveMeeting(ongoingMeeting.meetingId));
                  connectToVideo();
                }}
              >
                <CardContent>
                  <Typography
                    variant="body2"
                    align="center"
                    fontWeight={600}
                    color={"black"}
                  >
                    {ongoingMeeting.name} pågår
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              position: "relative",
            }}
          >
            <FlexNavcard
              backgroundColor={meetingRoomColor}
              navigationPage="createproject"
              title="Projekt"
              icon={
                <img
                  src="https://i.imgur.com/GvdAMWN.png"
                  alt="project management icon"
                  style={{ maxWidth: 40, height: 40 }}
                />
              }
              onClick={handleProjectDropdownToggle}
            />
            {showProjectDropdown && (
              <div
                className="dropdown-menu"
                style={{
                  position: "absolute",
                  top: "100%",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  zIndex: 999,
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => handleDropdownOptionClick("createproject")}
                  sx={{ color: "black", backgroundColor: "#F8F8F8" }}
                >
                  Nytt projekt
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleDropdownOptionClick("")}
                  sx={{ color: "black", backgroundColor: "#F8F8F8" }}
                >
                  Alla projekt
                </Button>
              </div>
            )}
          </div>

          <FlexNavcard
            backgroundColor={meetingRoomColor}
            navigationPage="healthcheck"
            title="Statistik"
            icon={
              <img
                src="https://i.imgur.com/XrvQ6nN.png"
                alt="pie chart icon"
                style={{ maxWidth: 40, height: 40 }}
              />
            }
          />

          <FlexNavcard
            backgroundColor={meetingRoomColor}
            navigationPage="settings"
            title="Inställningar"
            icon={
              <img
                src="https://i.imgur.com/U8AEeOy.png"
                alt="project management icon"
                style={{ maxWidth: 40, height: 40 }}
              />
            }
          />
        </Box>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            flex: 1,
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};
