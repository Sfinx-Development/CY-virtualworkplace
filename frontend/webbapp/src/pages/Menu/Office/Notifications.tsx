import {
  Box,
  Button,
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
import { getActiveTeam } from "../../../slices/teamSlice";

export default function Notifications() {
  const dispatch = useAppDispatch();
  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );

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
    <div>
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
    </div>
  );
}
