import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,

} from "@mui/material";
import { useAppDispatch } from "../../slices/store";
import { createMeetingAsync, Getmyactiveroom } from "../../slices/meetingSlice";
import { CreateMeetingDTO } from "../../../types";
import { useAppSelector } from "../../slices/store";
import { getActiveTeam} from "../../slices/teamSlice";
import { GetMyProfileAsync } from "../../slices/profileSlice";



export default function CreateMeetingPage() {
  const dispatch = useAppDispatch();
  const meetings = useAppSelector((state) => state.meetingSlice.meetings);
  const meetingroom = useAppSelector((state) => state.meetingSlice.meetingroom);
  const error = useAppSelector((state) => state.meetingSlice.error);

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
  const activeProfile = useAppSelector((state) => state.profileSlice.activeProfile);


    useEffect(() => {
      dispatch(getActiveTeam());
     
    }, []);

    useEffect(() => {
     if(activeTeam){
      dispatch(GetMyProfileAsync(activeTeam?.id));
      
      dispatch(Getmyactiveroom(activeTeam.id));
     }
  },[activeTeam] );
 
  const handleCreateMeeting = async () => {
    console.log("name: ", newMeetingName);
    console.log("des: ", newMeetingDescription);
    console.log("date: ", newMeetingDate);
    console.log("nmin: ", newMeetingMinutes);
    console.log("activeprofile id: ", activeProfile?.id);
    console.log("roomid: ", newMeetingRoomId);
    if (
      newMeetingName !== "" &&
      newMeetingDescription !== "" &&
      newMeetingDate !== "" &&
      activeProfile && meetingroom
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
        roomId: meetingroom.id, // Non-null assertion operator
        ownerId: activeProfile.id,
        interval: intervalAsString,
        endDate: parsedEndDate,
      };
  
      await dispatch(createMeetingAsync(meetingDto));
  
      setNewMeetingName("");
      setNewMeetingDescription("");
      setNewMeetingDate("");
      setNewMeetingMinutes(0);
      setNewMeetingIsRepeating(false);
      setNewMeetingInterval(0);
      setNewMeetingEndDate("");
      setOwner(""); // Återställ owner-fältet
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
        <Typography variant="h4">Create Meeting</Typography>
        <TextField
          label="Meeting Name"
          value={newMeetingName}
          onChange={(e) => setNewMeetingName(e.target.value)}
          variant="outlined"
          sx={{ width: "250px", marginTop: 2 }}
        />
        <TextField
          label="Description"
          value={newMeetingDescription}
          onChange={(e) => setNewMeetingDescription(e.target.value)}
          variant="outlined"
          sx={{ width: "250px", marginTop: 2 }}
        />
        <TextField
          label="Date"
          type="datetime-local"
          value={newMeetingDate}
          onChange={(e) => setNewMeetingDate(e.target.value)}
          variant="outlined"
          sx={{ width: "250px", marginTop: 2 }}
        />
        <TextField
          label="Minutes"
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
          label="Repeating"
          sx={{ width: "250px", marginTop: 2 }}
        />
        {newMeetingIsRepeating && (
          <>
            <TextField
              label="Interval"
              type="number"
              value={newMeetingInterval}
              onChange={(e) => setNewMeetingInterval(parseInt(e.target.value, 10))}
              variant="outlined"
              sx={{ width: "250px", marginTop: 2 }}
            />
            <TextField
              label="End Date"
              type="datetime-local"
              value={newMeetingEndDate}
              onChange={(e) => setNewMeetingEndDate(e.target.value)}
              variant="outlined"
              sx={{ width: "250px", marginTop: 2 }}
            />
          </>
        )}
<TextField
  type="hidden"
  value={newMeetingRoomId}
  onChange={(e) => setNewMeetingRoomId(e.target.value)} // Använd 'e' här
/>
<TextField
  type="hidden"
  value={activeProfile?.id || ""}
  onChange={(e) => setOwner(e.target.value)} // Använd 'e' här
/>
        <Button variant="contained" onClick={handleCreateMeeting}>
          Create Meeting
        </Button>

        {meetings && (
          <div>
            <Typography variant="h6">Latest Meeting:</Typography>
            <Typography>{meetings[meetings.length - 1].name}</Typography>
          </div>
        )}

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
