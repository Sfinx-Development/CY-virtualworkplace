import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import PieChartIcon from "@mui/icons-material/PieChart";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { isMobile } from "../../../globalConstants";
import { MeetingOccasionNoDate, ProfileHubDTO } from "../../../types";
import BackGroundDesign from "../../components/BackgroundDesign";
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);
  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );
  const onlineProfiles = useAppSelector(
    (state) => state.profileSlice.onlineProfiles
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

  const toggleOnlineList = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
    <Container
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: -1,
        padding: 2,
        margin: 0,
        width: "100%",
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
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "center",
            gap: isMobile ? 1 : 4,
            width: "100%",
            mt: isMobile ? 0 : 2,
          }}
        >
          <FlexNavcard
            backgroundColor={meetingRoomColor}
            navigationPage="createMeeting"
            title="Nytt möte"
            icon={
              <img
                src="https://i.imgur.com/HRZXZA9.png"
                alt="project management icon"
                style={{
                  width: isMobile ? 30 : 40,
                  height: isMobile ? 30 : 40,
                }}
              />
            }
          />

          <FlexNavcard
            backgroundColor={meetingRoomColor}
            navigationPage="meetinginteam"
            title="Alla möten"
            icon={
              <img
                src="https://i.imgur.com/HeztEpU.png"
                alt="project management icon"
                style={{ width: 40, height: 40 }}
              />
            }
          />

          <FlexNavcard
            backgroundColor={meetingRoomColor}
            navigationPage="createproject"
            title="Nytt projekt"
            icon={
              <img
                src="https://i.imgur.com/GvdAMWN.png"
                alt="project management icon"
                style={{ width: 40, height: 40 }}
              />
            }
          />

          <FlexNavcard
            backgroundColor={meetingRoomColor}
            navigationPage=""
            title="Alla projekt"
            icon={
              <img
                src="https://i.imgur.com/HeztEpU.png"
                alt="project management icon"
                style={{ width: 40, height: 40 }}
              />
            }
          />
          <FlexNavcard
            backgroundColor={meetingRoomColor}
            navigationPage="healthcheck"
            title="Statistik"
            icon={<PieChartIcon sx={{ fontSize: isMobile ? 30 : 40 }} />}
          />
          <FlexNavcard
            backgroundColor={meetingRoomColor}
            navigationPage="settings"
            title="Inställningar"
            icon={
              <img
                src="      https://i.imgur.com/6YGqDBk.png"
                alt="project management icon"
                style={{ width: 40, height: 40 }}
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
        {isMobile ? null : (
          <IconButton
            sx={{ position: "absolute", top: isMobile ? 30 : 10, right: 360 }}
            onClick={toggleOnlineList}
          >
            <Typography variant="body2">Medlemmar online</Typography>
            <ArrowDropDownIcon sx={{ transform: "rotate(-1eg)" }} />
          </IconButton>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {onlineProfiles && onlineProfiles.length > 0 ? (
            onlineProfiles.map((profile: ProfileHubDTO) => (
              <MenuItem key={profile.profileId} onClick={handleClose}>
                <FiberManualRecordIcon sx={{ color: "lightgreen" }} />
                <Typography>{profile.fullName}</Typography>
              </MenuItem>
            ))
          ) : (
            <MenuItem onClick={handleClose}>
              <Typography>Ingen profil online</Typography>
            </MenuItem>
          )}
        </Menu>
      </div>
    </Container>
  );
};
