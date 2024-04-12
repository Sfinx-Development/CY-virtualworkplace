import {
  Box,
  Button,
  Card,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { HealthCheck, ProfileHealthCheck } from "../../../../types";
import { RadioGroupRating } from "../../../components/StyledRating";
import {
  CreateProfileHealthCheckAsync,
  GetProfileHealthChecksByProfileAsync,
  GetTeamHealthChecksAsync,
} from "../../../slices/healthcheck";
import { getActiveProfile } from "../../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../../slices/store";
import {
  GetAllTeamRequestsAsync,
  getActiveTeam,
} from "../../../slices/teamSlice";

export default function Notifications() {
  const dispatch = useAppDispatch();
  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );
  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);
  const teamRequests = useAppSelector((state) => state.teamSlice.teamRequests);

  useEffect(() => {
    dispatch(getActiveTeam());
    dispatch(getActiveProfile());
  }, []);

  const healthchecks = useAppSelector(
    (state) => state.healthcheckSlice.healthchecks
  );
  const profilehealthchecks = useAppSelector(
    (state) => state.healthcheckSlice.profileHealthChecks
  );
  const [activeHealthChecks, setActiveHealthChecks] = useState<HealthCheck[]>();
  const [ratingShow, setRatingShow] = useState(false);
  const [healthCheckId, setHealthcheckId] = useState("");

  const handleRating = (healthCheckId: string, rating: number | null) => {
    if (activeProfile && rating !== null) {
      const profileHealthcheck: ProfileHealthCheck = {
        id: "undefined",
        date: new Date(),
        rating: rating,
        isAnonymous: true,
        profileId: activeProfile?.id,
        healthCheckId: healthCheckId,
      };
      dispatch(CreateProfileHealthCheckAsync(profileHealthcheck));
    }
    setRatingShow(false);
  };

  useEffect(() => {
    if (activeProfile) {
      dispatch(GetTeamHealthChecksAsync(activeProfile.id));
      dispatch(GetProfileHealthChecksByProfileAsync(activeProfile.id));
    }
  }, [activeProfile]);

  useEffect(() => {
    if (activeTeam) {
      dispatch(GetAllTeamRequestsAsync(activeTeam.id));
    }
  }, [activeTeam]);

  useEffect(() => {
    if (healthchecks && profilehealthchecks) {
      const activeHS = healthchecks.filter(
        (c) =>
          new Date(c.endTime) > new Date() && new Date(c.startTime) < new Date()
      );

      const filteredActiveHS = activeHS.filter((check) => {
        return !profilehealthchecks.some(
          (profileCheck) => profileCheck.healthCheckId === check.id
        );
      });

      setActiveHealthChecks(filteredActiveHS);
    }
  }, [healthchecks, profilehealthchecks, ratingShow]);

  return (
    <Container sx={{ display: "flex", height: "100%", gap: 4, padding: 4 }}>
      <Card sx={{ flex: 1, padding: 2 }}>
        {activeHealthChecks && activeHealthChecks.length > 0 ? (
          <Box mt={0.5}>
            {activeHealthChecks.length > 1 ? (
              <Typography>
                Du har fått {activeHealthChecks.length} frågor
              </Typography>
            ) : (
              <Typography>Du har fått 1 fråga</Typography>
            )}
            <List>
              {activeHealthChecks &&
                activeHealthChecks.map((check) => (
                  <ListItem key={check.id}>
                    <ListItemText
                      primary={check.question}
                      secondary={`${new Date(
                        check.startTime
                      ).toLocaleString()} - ${new Date(
                        check.endTime
                      ).toLocaleString()}`}
                    />

                    {ratingShow && healthCheckId == check.id ? (
                      <RadioGroupRating
                        onChange={(value) => handleRating(check.id, value)}
                      />
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setRatingShow(true);
                          setHealthcheckId(check.id);
                        }}
                      >
                        Svara
                      </Button>
                    )}
                  </ListItem>
                ))}
            </List>
          </Box>
        ) : (
          <Typography>Ingen oläst notis</Typography>
        )}
        {teamRequests && teamRequests.length > 0 ? (
          <Box mt={0.5}>
            {teamRequests.length > 1 ? (
              <Typography>
                Det finns {teamRequests.length} förfrågningar
              </Typography>
            ) : (
              <Typography>Det finns 1 förfrågan</Typography>
            )}
            <List>
              {teamRequests &&
                teamRequests.map((request) => (
                  <ListItem key={request.id}>
                    <ListItemText
                      primary={request.userFullName + " vill gå med i teamet"}
                    />
                  </ListItem>
                ))}
            </List>
          </Box>
        ) : (
          <Typography>Ingen oläst notis</Typography>
        )}
      </Card>
    </Container>
  );
}
