import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Card,
  CardContent,
  Container,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import {
  GetMyMeetingsAsync,
  GetMyPastMeetingsAsync,
} from "../../slices/meetingSlice";
import { GetMyProfileAsync, GetTeamProfiles } from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";

import { theme1 } from "../../theme";

export default function MeetingInTeamsPage() {
  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);
  const occasions = useAppSelector((state) => state.meetingSlice.occasions);
  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );
  // const [loadedOnlineProfiles, setLoadedOnlineProfiles] = useState(false);

  //   const primaryColor = theme1.palette.primary.main;
  const officeColor = theme1.palette.office.main;
  //   const meetingRoomColor = theme1.palette.room.main;
  const chatRoomColor = theme1.palette.chat.main;
  //   const leaveColor = theme1.palette.leave.main;
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getActiveTeam());
  }, []);

  useEffect(() => {
    if (activeTeam) {
      dispatch(GetMyProfileAsync(activeTeam?.id));
      dispatch(GetTeamProfiles(activeTeam?.id));
      // dispatch(GetOnlineProfiles(activeTeam?.id));
      // setLoadedOnlineProfiles(true);
    }
  }, [dispatch, activeTeam]);

  useEffect(() => {
    if (activeProfile) {
      console.log("OCH HÄR AKTIV PROFIL: ", activeProfile);
      dispatch(GetMyMeetingsAsync(activeProfile.id));
      dispatch(GetMyPastMeetingsAsync(activeProfile.id));
    }
  }, [activeProfile]);

  const currentDate = new Date();
  const upcomingMeetings = occasions
    ? occasions.filter((occasion) => new Date(occasion.date) >= currentDate)
    : [];

  const pastMeetings =
    useAppSelector((state) => state.meetingSlice.pastOccasions) || [];

  //   const handleDeleteMeeting = (meetingId: string) => {
  //     dispatch(DeleteMeetingAsync(meetingId));
  //   };

  return (
    <Container>
      <Typography variant="h4">Mötes scheman för {activeTeam?.name}</Typography>

      <Box>
        {upcomingMeetings.length > 0 && (
          <Box>
            <Typography variant="h5">Kommande möten</Typography>
            {upcomingMeetings?.map((meeting) => (
              <Card
                key={meeting.id}
                style={{ marginBottom: "15px", backgroundColor: officeColor }}
              >
                <CardContent>
                  <Typography variant="subtitle1">{meeting.name}</Typography>
                  <Typography variant="body2">
                    {meeting.date.toString()}
                    <IconButton
                      style={{ position: "absolute", right: 250 }}
                      //   onClick={() => handleDeleteMeeting(meeting.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Typography>
                  <Typography>{meeting.description}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {pastMeetings.length > 0 && (
          <Box>
            <Typography variant="h5">Passerade möten</Typography>
            {pastMeetings?.map((meeting) => (
              <Card
                key={meeting.id}
                style={{ marginBottom: "15px", backgroundColor: chatRoomColor }}
              >
                <CardContent>
                  <Typography variant="subtitle1">
                    {meeting.name}
                    <IconButton
                      style={{ position: "absolute", right: 250 }}
                      //   onClick={() => handleDeleteMeeting(meeting.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Typography>
                  <Typography variant="body2">
                    {meeting.date.toString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
}
