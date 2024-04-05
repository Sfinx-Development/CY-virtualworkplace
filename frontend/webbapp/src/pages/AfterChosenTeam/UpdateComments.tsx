import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../../globalConstants";
import { UpdateComment, UpdateCommentNoDate } from "../../../types";
import UpdatePreview from "../../components/UpdatePreview";
import { getActiveProfile } from "../../slices/profileSlice";
import {
  DeleteCommentAsync,
  EditCommentAsync,
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
  const [openTodoPopup, setOpenTodoPopup] = useState(false);
  const [updatedText, setUpdatedText] = useState("");
  const [commentIdToEdit, setCommentIdToEdit] = useState("");
  const navigate = useNavigate();
  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );

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

  const handleDeleteComment = (commentId: string) => {
    dispatch(DeleteCommentAsync(commentId));
    setOpenTodoPopup(false);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleUpdateComment();
    }
  };

  const handleUpdateComment = () => {
    console.log("KÖRS");
    const comment = comments?.find((c) => c.id == commentIdToEdit);
    if (comment && updatedText != "") {
      const updatedComment: UpdateComment = {
        ...comment,
        text: updatedText,
        dateCreated: new Date(comment.dateCreated),
      };
      console.log("UPPDATERADE: ", updatedComment);
      dispatch(EditCommentAsync(updatedComment));
    }
    setCommentIdToEdit("");
    setUpdatedText("");
  };

  const handleSetEdit = (comment: UpdateCommentNoDate) => {
    setCommentIdToEdit(comment.id);
    setUpdatedText(comment.text);
  };

  return (
    <Container>
      <Typography variant={isMobile ? "h5" : "h4"}>
        {activeUpdate?.title ?? "Ingen titel"}
      </Typography>
      <Box>
        {comments && comments.length > 0 && (
          <Box>
            <Typography variant="h5">Händelser</Typography>
            {comments?.map((comment: UpdateCommentNoDate) => (
              <Card key={comment.id} style={{ marginBottom: "15px" }}>
                <Dialog
                  open={openTodoPopup}
                  onClose={() => setOpenTodoPopup(false)}
                >
                  <DialogTitle>Ta bort</DialogTitle>
                  <DialogContent dividers>
                    <Typography>
                      Är du säker på att du vill radera kommentaren permanent?
                    </Typography>
                    <IconButton onClick={() => handleDeleteComment(comment.id)}>
                      <Typography>Ta bort</Typography>
                    </IconButton>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setOpenTodoPopup(false)}>
                      Stäng
                    </Button>
                  </DialogActions>
                </Dialog>

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
                    {commentIdToEdit == comment.id ? (
                      <TextField
                        value={updatedText}
                        onChange={(e) => setUpdatedText(e.target.value)}
                        variant="outlined"
                        sx={{ width: "250px", marginTop: 2 }}
                        onKeyDown={handleKeyPress}
                      />
                    ) : (
                      <Typography variant="body2">{comment.text}</Typography>
                    )}

                    {commentIds?.find((c) => c == comment.id) ? (
                      <div>
                        <UpdatePreview
                          updateComment={comment}
                          isMyUpdateComment={
                            activeProfile?.id == comment.profileId
                          }
                        />
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
                  {comment.profileId == activeProfile?.id ? (
                    <div>
                      <IconButton onClick={() => setOpenTodoPopup(true)}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          handleSetEdit(comment);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
        <Card
          sx={{
            display: "flex",
            flex: 1,
          }}
        >
          <CardActionArea
            onClick={() => {
              navigate("/createcomment");
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent
                sx={{
                  flex: "1 0 auto",
                  flexDirection: "row",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <AddIcon
                  sx={{
                    textAlign: "center",
                    fontSize: isMobile ? "10" : "22",
                    marginRight: 0.5,
                  }}
                />
                <Typography
                  component="div"
                  sx={{ textAlign: "center", fontSize: isMobile ? "10" : "22" }}
                >
                  Ny kommentar
                </Typography>
              </CardContent>
            </Box>
          </CardActionArea>
        </Card>
      </Box>
    </Container>
  );
}
