import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { isMobile } from "../../../globalConstants";
import { UpdateComment } from "../../../types";
import UpdatePreview from "../../components/UpdatePreview";
import { getActiveProfile } from "../../slices/profileSlice";
import {
  GetUpdateCommentsAsync,
  getActiveUpdate,
} from "../../slices/projectSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";

export default function UpdateComments() {
  const activeUpdate = useAppSelector(
    (state) => state.projectSlice.activeUpdate
  );

  const comments = useAppSelector((state) => state.projectSlice.activeComments);
  const dispatch = useAppDispatch();
  const [commentIds, setCommentIds] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    dispatch(getActiveTeam());
    dispatch(getActiveProfile());
    dispatch(getActiveUpdate());
  }, []);

  useEffect(() => {
    if (activeUpdate) {
      dispatch(GetUpdateCommentsAsync(activeUpdate.id));
    }
  }, [activeUpdate]);

  const handleSetOpen = (commentId: string) => {
    if (commentIds) {
      const updatedIds = [...commentIds, commentId];
      setCommentIds(updatedIds);
    } else {
      const updatedIds = [commentId];
      setCommentIds(updatedIds);
    }
  };

  const handleClose = (commentId: string) => {
    if (commentIds) {
      const updatedCommentIds = commentIds.filter((c) => c !== commentId);
      setCommentIds(updatedCommentIds);
    }
  };

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
                    {commentIds?.find((c) => c == comment.id) ? (
                      <div>
                        <UpdatePreview updateComment={comment} />
                        <Button
                          onClick={() => {
                            handleClose(comment.id);
                          }}
                        >
                          Stäng
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => {
                          handleSetOpen(comment.id);
                        }}
                      >
                        Visa filer
                      </Button>
                    )}

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
