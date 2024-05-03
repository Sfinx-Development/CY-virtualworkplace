import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../../globalConstants";
import { CreateMeetingDTO } from "../../../types";
import { createTeamMeetingAsync } from "../../slices/meetingSlice";
import { GetMyProfileAsync } from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";

export default function CreateMeetingPage() {
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.meetingSlice.error);
  const navigate = useNavigate();

  const [newMeetingName, setNewMeetingName] = useState("");
  const [newMeetingDescription, setNewMeetingDescription] = useState("");
  const [newMeetingDate, setNewMeetingDate] = useState("");
  const [newMeetingMinutes, setNewMeetingMinutes] = useState(0);
  const [newMeetingIsRepeating, setNewMeetingIsRepeating] = useState(false);
  const [, setOwner] = useState("");
  const [newMeetingInterval, setNewMeetingInterval] = useState(0);
  const [newMeetingEndDate, setNewMeetingEndDate] = useState("");
  const [fieldError, setFieldError] = useState(false);
  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);
  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );

  useEffect(() => {
    dispatch(getActiveTeam());
  }, []);

  useEffect(() => {
    if (activeTeam) {
      dispatch(GetMyProfileAsync(activeTeam?.id));
    }
  }, [activeTeam]);

  const handleCreateMeeting = async () => {
    if (
      newMeetingName !== "" &&
      newMeetingDescription !== "" &&
      newMeetingDate !== "" &&
      activeProfile &&
      activeTeam
    ) {
      setFieldError(false);

      const intervalAsString = newMeetingInterval.toString();
      const parsedDate = new Date(newMeetingDate);
      let parsedEndDate;
      if (newMeetingEndDate) {
        parsedEndDate = new Date(newMeetingEndDate);
      }

      const meetingDto: CreateMeetingDTO = {
        name: newMeetingName,
        description: newMeetingDescription,
        date: parsedDate,
        minutes: newMeetingMinutes.toString(),
        isRepeating: newMeetingIsRepeating,
        ownerId: activeProfile.id,
        interval: intervalAsString,
        endDate: parsedEndDate,
        teamId: activeTeam?.id,
      };

      await dispatch(createTeamMeetingAsync(meetingDto));

      setNewMeetingName("");
      setNewMeetingDescription("");
      setNewMeetingDate("");
      setNewMeetingMinutes(0);
      setNewMeetingIsRepeating(false);
      setNewMeetingInterval(0);
      setNewMeetingEndDate("");
      setOwner(""); // Återställ owner-fältet
      navigate("/meetingroom/meetinginteam");
    } else {
      setFieldError(true);
    }
  };

  return (
    <Container
      sx={{
        padding: "20px",
        margin: 1,
        display: "flex",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {fieldError && (
            <Typography color="error">Alla fält måste vara ifyllda</Typography>
          )}
          <TextField
            label="Mötesnamn"
            value={newMeetingName}
            onChange={(e) => setNewMeetingName(e.target.value)}
            variant="outlined"
            sx={{ width: "250px", marginTop: 2 }}
          />
          <TextField
            label="Beskrivning"
            value={newMeetingDescription}
            onChange={(e) => setNewMeetingDescription(e.target.value)}
            variant="outlined"
            sx={{ width: "250px", marginTop: 2 }}
          />

          <TextField
            label="Datum"
            type="datetime-local"
            value={newMeetingDate}
            onChange={(e) => setNewMeetingDate(e.target.value)}
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
            label="Minuter"
            type="number"
            value={newMeetingMinutes}
            onChange={(e) => setNewMeetingMinutes(parseInt(e.target.value, 10))}
            variant="outlined"
            sx={{ width: "250px", marginTop: 2 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={newMeetingIsRepeating}
                onChange={() =>
                  setNewMeetingIsRepeating(!newMeetingIsRepeating)
                }
              />
            }
            label="Upprepas"
            sx={{ width: "250px", marginTop: 1 }}
          />
          {!newMeetingIsRepeating ? (
            <Button
              variant="contained"
              onClick={handleCreateMeeting}
              sx={{ marginTop: 1, width: "250px" }}
            >
              Skapa möte
            </Button>
          ) : null}
        </div>
        {newMeetingIsRepeating && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
            }}
          >
            <TextField
              label="Intervall"
              type="number"
              value={newMeetingInterval}
              onChange={(e) =>
                setNewMeetingInterval(parseInt(e.target.value, 10))
              }
              variant="outlined"
              sx={{ width: "250px", marginTop: 2 }}
            />
            <TextField
              label="Slutdatum"
              type="datetime-local"
              value={newMeetingEndDate}
              onChange={(e) => setNewMeetingEndDate(e.target.value)}
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
              sx={{ marginTop: 2, width: "250px" }}
            >
              Skapa möte
            </Button>
          </div>
        )}
        {error && <Typography color="error">{error}</Typography>}
      </div>
    </Container>
  );
}
