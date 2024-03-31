import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Card,
  CardContent,
  Container,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { isMobile } from "../../../globalConstants";
import { UpdateComment } from "../../../types";
import { getActiveProfile } from "../../slices/profileSlice";
import {
  GetUpdateCommentsAsync,
  getActiveUpdate,
} from "../../slices/projectSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";

export default function MeetingInTeamsPage() {
  //   const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);
  //   const activeProfile = useAppSelector(
  //     (state) => state.profileSlice.activeProfile
  //   );
  const activeUpdate = useAppSelector(
    (state) => state.projectSlice.activeUpdate
  );

  const comments = useAppSelector((state) => state.projectSlice.activeComments);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getActiveTeam());
    dispatch(getActiveProfile());
    dispatch(getActiveUpdate());
  }, []);

  useEffect(() => {
    if (activeUpdate) {
      dispatch(GetUpdateCommentsAsync(activeUpdate.id));
    }
  }, [activeUpdate]); // Använd en tom beroendearray för att köra useEffect bara en gång när komponenten monteras

  return (
    <Container>
      <Typography variant={isMobile ? "h5" : "h4"}>
        {comments && comments[0].text}
      </Typography>

      <Box>
        {comments && comments.length > 0 && (
          <Box>
            <Typography variant="h5">Händelser</Typography>
            {comments?.map((comment: UpdateComment) => (
              <Card key={comment.id} style={{ marginBottom: "15px" }}>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <Typography variant="subtitle1">
                      {comment.dateCreated.toString()}
                    </Typography>

                    <Typography variant="body2">{comment.text}</Typography>
                    <Typography variant="subtitle2">
                      {comment.profileFullName}
                    </Typography>
                  </div>
                  <div>
                    <IconButton
                    //   onClick={() => handleDeleteMeeting(meeting.meetingId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      //   onClick={() => handleSetEditMode(meeting.meetingId)}
                    >
                      <EditIcon />
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
