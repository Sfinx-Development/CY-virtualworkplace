import { Button, Container, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../../globalConstants";
import { HealthCheck } from "../../../types";
import { CreateHealthCheckAsync } from "../../slices/healthcheck";
import { GetMyProfileAsync } from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";

export default function ProfileHealthCheck() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);

  const [question, setQuestion] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fieldError, setFieldError] = useState(false);

  useEffect(() => {
    dispatch(getActiveTeam());
  }, []);

  useEffect(() => {
    if (activeTeam) {
      dispatch(GetMyProfileAsync(activeTeam?.id));
    }
  }, [activeTeam]);

  const handleCreateMeeting = async () => {
    if (question !== "" && startDate !== "" && endDate !== "" && activeTeam) {
      setFieldError(false);

      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);

      const healthcheck: HealthCheck = {
        id: "undefined",
        question: question,
        startTime: parsedStartDate,
        endTime: parsedEndDate,
        teamId: activeTeam?.id,
      };

      await dispatch(CreateHealthCheckAsync(healthcheck));

      setEndDate("");
      setStartDate("");
      setQuestion("");
      navigate("/meetingroom");
    } else {
      setFieldError(true);
    }
  };

  return (
    <Container sx={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {fieldError && (
          <Typography color="error">Alla fält måste vara ifyllda</Typography>
        )}
        <Typography variant={isMobile ? "h5" : "h4"}>Kolla läget</Typography>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{ textAlign: "center", fontSize: isMobile ? 15 : 20 }}
          >
            Ställ en fråga eller ett påstående till alla i ditt team.
          </Typography>
          <Typography
            sx={{ textAlign: "center", fontSize: isMobile ? 15 : 20 }}
          >
            Välj en tidsperiod för när svaren ska samlas in och få sedan
            statistik på ett genomsnittligt svar.
          </Typography>
        </div>
        <TextField
          label="Trivs du med dina arbetsuppgifter just nu?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          multiline
          variant="outlined"
          sx={{ width: "250px", marginTop: 2 }}
        />
        <TextField
          label="Startdatum"
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          variant="outlined"
          sx={{
            width: "250px",
            marginTop: 2,
            "& label": {
              color: "transparent",
            },
            "&:focus label": {
              color: "initial",
            },
          }}
        />

        <TextField
          label="Slutdatum"
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          variant="outlined"
          sx={{
            width: "250px",
            marginTop: 2,
            "& label": {
              color: "transparent",
            },
            "&:focus label": {
              color: "initial",
            },
          }}
        />

        <Button
          variant="contained"
          onClick={handleCreateMeeting}
          sx={{ marginTop: 2 }}
        >
          Skapa
        </Button>
      </div>
    </Container>
  );
}
