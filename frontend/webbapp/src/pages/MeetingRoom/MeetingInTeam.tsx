import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Card,
  CardContent,
  Container,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { MeetingNoDate, MeetingOccasionNoDate } from "../../../types";
import {
  DeleteMeetingAsync,
  EditMeetingAsync,
  GetMyMeetingsAsync,
  GetMyOccasionsAsync,
  GetMyPastMeetingsAsync,
} from "../../slices/meetingSlice";
import { getActiveProfile } from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";
import { theme1 } from "../../theme";
import { formatDate } from "../../../dateUtil";

export default function MeetingInTeamsPage() {
  const occasions = useAppSelector((state) => state.meetingSlice.occasions);
  const meetings = useAppSelector((state) => state.meetingSlice.meetings);
  const error = useAppSelector((state) => state.meetingSlice.error);
  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [meetingIdToEdit, setMeetingIdToEdit] = useState("");
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedDate, setEditedDate] = useState("");

  const officeColor = theme1.palette.office.main;
  const chatRoomColor = theme1.palette.chat.main;
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getActiveTeam());
    dispatch(getActiveProfile());
  }, []);

  useEffect(() => {
    if (activeProfile) {
      dispatch(GetMyMeetingsAsync(activeProfile.id));
      dispatch(GetMyOccasionsAsync(activeProfile.id));
      dispatch(GetMyPastMeetingsAsync(activeProfile.id));
    }
  }, []);

  const currentDate = new Date();
  const upcomingMeetings =
    occasions && Array.isArray(occasions)
      ? occasions.filter(
          (occasion: MeetingOccasionNoDate) =>
            new Date(occasion.date) >= currentDate
        )
      : [];

  const pastMeetings =
    useAppSelector((state) => state.meetingSlice.pastOccasions) || [];

  const handleDeleteMeeting = (meetingId: string) => {
    dispatch(DeleteMeetingAsync(meetingId));
  };
  const handleEditMeeting = () => {
    if (meetingIdToEdit && isEditMode && meetings) {
      const meetingToUpdate = meetings.find((m) => m.id == meetingIdToEdit);
      if (meetingToUpdate) {
        // Använd Date.parse() för att tolka datumsträngen i lokala tidszonen

        if (editedDate) {
          // Kontrollera att tolkningen är giltig
          const updatedMeeting: MeetingNoDate = {
            ...meetingToUpdate,
            name: editedName,
            description: editedDescription,
            date: new Date(editedDate).toString(),
          };
          dispatch(EditMeetingAsync(updatedMeeting));
        } else {
          console.error("Ogiltig datumsträng");
        }
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleEditMeeting();
      setIsEditMode(false);
    }
  };

  const handleSetEditMode = (meetingId: string) => {
    if (meetings) {
      const meetingToEdit = meetings.find(
        (m: { id: string }) => m.id == meetingId
      );
      if (meetingToEdit) {
        setIsEditMode(true);
        setEditedName(meetingToEdit?.name);
        setEditedDescription(meetingToEdit?.description);
        const localDate = new Date(meetingToEdit.date).toLocaleString("sv-SE", {
          timeZone: "Europe/Stockholm",
        });
        setEditedDate(localDate);
        setMeetingIdToEdit(meetingToEdit.id);
      }
    }
  };

  return (
    <Container sx={{ width: "100%" }}>
      {error ? (
        <Typography>Endast skapare av mötet kan radera</Typography>
      ) : null}
      <Box sx={{ width: "90%" }}>
        {upcomingMeetings && upcomingMeetings.length > 0 ? (
          <>
            <Typography variant="h5">Kommande möten</Typography>
            {upcomingMeetings?.map((meeting: MeetingOccasionNoDate) => (
              <Card
                key={meeting.id}
                style={{ marginBottom: "15px", backgroundColor: officeColor }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {isEditMode && meetingIdToEdit == meeting.meetingId ? (
                      <TextField
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        type="text"
                        fullWidth
                        variant="outlined"
                        onKeyDown={handleKeyPress}
                      />
                    ) : (
                      <Typography variant="subtitle1">
                        {meeting.name}
                      </Typography>
                    )}
                    {isEditMode && meeting.meetingId == meetingIdToEdit ? (
                      <TextField
                        label="Date"
                        type="datetime-local"
                        value={editedDate}
                        onChange={(e) => setEditedDate(e.target.value)}
                        variant="outlined"
                        sx={{ width: "250px", marginTop: 2 }}
                        onKeyDown={handleKeyPress}
                      />
                    ) : (
                      <Typography variant="body2">
                        {formatDate(new Date(meeting.date))}
                      </Typography>
                    )}
                    {isEditMode && meetingIdToEdit == meeting.meetingId ? (
                      <TextField
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        type="text"
                        fullWidth
                        variant="outlined"
                        onKeyDown={handleKeyPress}
                      />
                    ) : (
                      <Typography variant="subtitle1">
                        {meeting.description}
                      </Typography>
                    )}
                  </div>
                  <div>
                    <IconButton
                      size="small"
                      onClick={() => handleSetEditMode(meeting.meetingId)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteMeeting(meeting.meetingId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <Typography>Inga kommande möten</Typography>
        )}

        {pastMeetings && pastMeetings.length > 0 && (
          <Box>
            <Typography variant="h5">Passerade möten</Typography>
            {pastMeetings?.map((meeting: MeetingOccasionNoDate) => (
              <Card
                key={meeting.id}
                style={{ marginBottom: "15px", backgroundColor: chatRoomColor }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <Typography variant="subtitle1">{meeting.name}</Typography>
                    <Typography variant="body2">
                      {formatDate(new Date(meeting.date))}
                    </Typography>
                  </div>
                  <div>
                    <IconButton
                      onClick={() => handleDeleteMeeting(meeting.meetingId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
}
