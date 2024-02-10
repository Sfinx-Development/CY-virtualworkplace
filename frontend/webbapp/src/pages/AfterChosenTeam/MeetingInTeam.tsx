import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../slices/store";
import { GetMyMeetingsAsync } from "../../slices/meetingSlice";
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
    }
  }, [activeProfile]);

  return (
    <Container>
      <Typography variant="h4">Här är dina möten</Typography>

      <Box>
        {occasions && occasions.map((occasion) => (
          <Card key={occasion.id}>
            <CardContent>
              <Typography>{occasion.name
              } - {occasion.date.toString()}</Typography>
              {/* Display other meeting details as needed */}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}
