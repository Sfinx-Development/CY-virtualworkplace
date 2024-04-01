import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Card,
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
  DeleteFileAsync,
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
    navigate("/menu");
  };

  const handleDeleteFile = (fileId: string) => {
    dispatch(DeleteFileAsync(fileId));
  };

  const handleUpdateComment = () => {
    const comment = comments?.find((c) => c.id == commentIdToEdit);
    if (comment) {
      const updatedComment: UpdateComment = {
        ...comment,
        dateCreated: new Date(comment.dateCreated),
      };
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
        {comments && comments[0].text}
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
                        onKeyDown={handleUpdateComment}
                      />
                    ) : (
                      <Typography variant="body2">{comment.text}</Typography>
                    )}

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
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
}
