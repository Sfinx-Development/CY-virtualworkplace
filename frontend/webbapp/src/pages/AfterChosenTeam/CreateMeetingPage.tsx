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
import { CreateMeetingDTO } from "../../../types";
import {
  Getmyactiveroom,
  createTeamMeetingAsync,
} from "../../slices/meetingSlice";
import { GetMyProfileAsync } from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";

export default function CreateMeetingPage() {
  const dispatch = useAppDispatch();
  const meetingroom = useAppSelector((state) => state.meetingSlice.meetingroom);
  const error = useAppSelector((state) => state.meetingSlice.error);
  const navigate = useNavigate();

  const [newMeetingName, setNewMeetingName] = useState("");
  const [newMeetingDescription, setNewMeetingDescription] = useState("");
  const [newMeetingDate, setNewMeetingDate] = useState("");
  const [newMeetingMinutes, setNewMeetingMinutes] = useState(0);
  const [newMeetingIsRepeating, setNewMeetingIsRepeating] = useState(false);
  const [newMeetingRoomId, setNewMeetingRoomId] = useState("");
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

      dispatch(Getmyactiveroom(activeTeam.id));
    }
  }, [activeTeam]);

  const handleCreateMeeting = async () => {
    if (
      newMeetingName !== "" &&
      newMeetingDescription !== "" &&
      newMeetingDate !== "" &&
      activeProfile &&
      meetingroom &&
      activeTeam
    ) {
      setFieldError(false);

      const intervalAsString = newMeetingInterval.toString();
      const parsedDate = new Date(newMeetingDate);
      const parsedEndDate = new Date(newMeetingEndDate);

      const meetingDto: CreateMeetingDTO = {
        name: newMeetingName,
        description: newMeetingDescription,
        date: parsedDate,
        minutes: newMeetingMinutes.toString(),
        isRepeating: newMeetingIsRepeating,
        roomId: meetingroom.id,
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
      navigate("/meetinginteam");
    } else {
      setFieldError(true);
    }
  };

  return (
    <Container sx={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          height: "100%",
        }}
      >
        {fieldError && (
          <Typography color="error">Alla fält måste vara ifyllda</Typography>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* <Typography variant="h6">Skapa ett nytt möte</Typography> */}
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
              sx={{ marginTop: 1 }}
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
              sx={{ marginTop: 2 }}
            >
              Skapa möte
            </Button>
          </div>
        )}

        {/* {meetings && (
          <div>
            <Typography variant="h6">Latest Meeting:</Typography>
            <Typography>{meetings[meetings.length - 1].name}</Typography>
          </div>
        )} */}

        {error && <Typography color="error">{error}</Typography>}
      </div>
    </Container>
  );
}

// import { Container, Typography } from "@mui/material";

// import { useParams } from "react-router-dom";
// import { Meeting } from "../../../types";
// import { useAppSelector } from "../../slices/store";

// export default function CreateMeeting() {
//   const { meetingId } = useParams<{ meetingId: string }>();
//   const meetings = useAppSelector((state) => state.meetingSlice.meetings);
//   const activeMeeting: Meeting | undefined = meetings?.find(
//     (meeting) => String(meeting.id) === meetingId
//     );
//   return (
//     <Container sx={{ padding: "20px" }}>
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         create meeting
//         <Typography variant={"h4"}>MEETING: {activeMeeting?.name}</Typography>
//       </div>
//     </Container>
//   );
// }
