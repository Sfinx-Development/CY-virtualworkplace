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
import { Survey, ProfileToSurvey, TeamRequest } from "../../../../types";
import { RadioGroupRating } from "../../../components/StyledRating";
import {
  GetMyOwnerRequestAsync,
  getActiveProfile,
} from "../../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../../slices/store";
import {
  CreateProfileSurveyAsync,
  GetProfileSurveysByProfileAsync,
  GetTeamSurveysAsync,
} from "../../../slices/survey";
import {
  GetAllTeamRequestsAsync,
  getActiveTeam,
  updateTeamRequestAsync,
} from "../../../slices/teamSlice";

export default function Notifications() {
  const dispatch = useAppDispatch();
  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );
  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);
  const teamRequests = useAppSelector((state) => state.teamSlice.teamRequests);
  const ownerRequest = useAppSelector(
    (state) => state.profileSlice.myOwnerRequest
  );
  useEffect(() => {
    dispatch(getActiveTeam());
    dispatch(getActiveProfile());
  }, []);

  const surveys = useAppSelector((state) => state.surveySlice.surveys);
  const profilesurveys = useAppSelector(
    (state) => state.surveySlice.profileSurveys
  );
  const [activeSurveys, setActiveSurveys] = useState<Survey[]>();
  const [ratingShow, setRatingShow] = useState(false);
  const [surveyId, setSurveyId] = useState("");

  const handleRating = (surveyId: string, rating: number | null) => {
    if (activeProfile && rating !== null) {
      const profileSurvey: ProfileToSurvey = {
        id: "undefined",
        date: new Date(),
        rating: rating,
        isAnonymous: true,
        profileId: activeProfile?.id,
        surveyId: surveyId,
      };
      dispatch(CreateProfileSurveyAsync(profileSurvey));
    }
    setRatingShow(false);
  };

  const approveRequest = (request: TeamRequest) => {
    const updatedRequest: TeamRequest = {
      ...request,
      isConfirmed: true,
      canJoin: true,
    };
    dispatch(updateTeamRequestAsync(updatedRequest));
  };

  const disApproveRequest = (request: TeamRequest) => {
    const updatedRequest: TeamRequest = {
      ...request,
      isConfirmed: true,
      canJoin: false,
    };
    dispatch(updateTeamRequestAsync(updatedRequest));
  };

  useEffect(() => {
    if (activeProfile) {
      dispatch(GetTeamSurveysAsync(activeProfile.id));
      dispatch(GetProfileSurveysByProfileAsync(activeProfile.id));
      dispatch(GetMyOwnerRequestAsync(activeProfile.id));
    }
  }, [activeProfile]);

  useEffect(() => {
    if (activeTeam) {
      dispatch(GetAllTeamRequestsAsync(activeTeam.id));
    }
  }, [activeTeam]);

  useEffect(() => {
    if (surveys && profilesurveys) {
      const activeHS = surveys.filter(
        (c) =>
          new Date(c.endTime) > new Date() && new Date(c.startTime) < new Date()
      );

      const filteredActiveHS = activeHS.filter((check) => {
        return !profilesurveys.some(
          (profileCheck) => profileCheck.surveyId === check.id
        );
      });

      setActiveSurveys(filteredActiveHS);
    }
  }, [surveys, profilesurveys, ratingShow]);

  return (
    <Container sx={{ display: "flex", height: "100%", gap: 4, padding: 4 }}>
      <Card sx={{ flex: 1, padding: 2 }}>
        {activeSurveys && activeSurveys.length > 0 ? (
          <Box mt={0.5}>
            {activeSurveys.length > 1 ? (
              <Typography>Du har fått {activeSurveys.length} frågor</Typography>
            ) : (
              <Typography>Du har fått 1 fråga</Typography>
            )}
            <List>
              {activeSurveys &&
                activeSurveys.map((check) => (
                  <ListItem key={check.id}>
                    <ListItemText
                      primary={check.question}
                      secondary={`${new Date(
                        check.startTime
                      ).toLocaleString()} - ${new Date(
                        check.endTime
                      ).toLocaleString()}`}
                    />

                    {ratingShow && surveyId == check.id ? (
                      <RadioGroupRating
                        onChange={(value) => handleRating(check.id, value)}
                      />
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setRatingShow(true);
                          setSurveyId(check.id);
                        }}
                      >
                        Svara
                      </Button>
                    )}
                  </ListItem>
                ))}
            </List>
          </Box>
        ) : null}
        {teamRequests &&
        activeProfile &&
        activeProfile.isOwner &&
        teamRequests.length > 0 ? (
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
                    <Button
                      onClick={() => {
                        approveRequest(request);
                      }}
                    >
                      Godkänn
                    </Button>
                    <Button
                      onClick={() => {
                        disApproveRequest(request);
                      }}
                    >
                      Neka
                    </Button>
                  </ListItem>
                ))}
            </List>
          </Box>
        ) : null}
        {teamRequests?.length == 0 && activeSurveys?.length == 0 ? (
          <Box mt={0.5}>
            <Typography>Ingen oläst notifikation</Typography>
          </Box>
        ) : null}
        {ownerRequest && (
          <Box>
            <Typography>
              Du har fått en förfrågan om att bli ägare av teamet
            </Typography>
            <Button
              onClick={() => {
                console.log("JA");
              }}
            >
              Godkänn
            </Button>
            <Button
              onClick={() => {
                console.log("NEJ");
              }}
            >
              Neka
            </Button>
          </Box>
        )}
      </Card>
    </Container>
  );
}
