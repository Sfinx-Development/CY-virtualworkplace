import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../slices/store";
import { GetMyMeetingsAsync, GetMyPastMeetingsAsync } from "../../slices/meetingSlice";
import {
  GetMyProfileAsync,
  GetOnlineProfiles,
  GetTeamProfiles,
} from "../../slices/profileSlice";
import { getActiveTeam } from "../../slices/teamSlice";
import { Typography, Container, Card, CardContent, Box } from "@mui/material";

export default function MeetingInTeamsPage() {
  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);
  const occasions = useAppSelector(state => state.meetingSlice.occasions);
  const activeProfile = useAppSelector((state) => state.profileSlice.activeProfile);
  const [loadedOnlineProfiles, setLoadedOnlineProfiles] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getActiveTeam());
  }, []);

  useEffect(() => {
    if (activeTeam && !loadedOnlineProfiles) {
      dispatch(GetMyProfileAsync(activeTeam?.id));
      dispatch(GetTeamProfiles(activeTeam?.id));
      dispatch(GetOnlineProfiles(activeTeam?.id));
      setLoadedOnlineProfiles(true);
    }
  }, [dispatch, activeTeam, loadedOnlineProfiles]);

  
  useEffect(() => {
    if(activeProfile){
      dispatch(GetMyMeetingsAsync(activeProfile.id));
      dispatch(GetMyPastMeetingsAsync(activeProfile.id))
    }
  }, [activeProfile]);

  const currentDate = new Date();
  const upcomingMeetings = occasions
    ? occasions.filter((occasion) => new Date(occasion.date) >= currentDate)
    : [];
  
  const pastMeetings = useAppSelector((state) => state.meetingSlice.pastOccasions) || [];

  return (
    <Container>
      <Typography variant="h4">Mötes scheman för {activeTeam?.name}</Typography>

      <Box>
        {upcomingMeetings.length > 0 && (
          <Box>
            <Typography variant="h5">Kommande möten</Typography>
            {upcomingMeetings?.map((meeting) => (
              <Card key={meeting.id} style={{ marginBottom: "15px" }}>
                <CardContent>
                  <Typography variant="subtitle1">{meeting.name}</Typography>
                  <Typography variant="body2">{meeting.date.toString()}</Typography>
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
              <Card key={meeting.id} style={{ marginBottom: "15px" }}>
                <CardContent>
                  <Typography variant="subtitle1">{meeting.name}</Typography>
                  <Typography variant="body2">{meeting.date.toString()} - {meeting.description}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
}
