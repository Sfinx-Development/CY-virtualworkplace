import { Button, Container, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../../globalConstants";
import { UpdateComment } from "../../../types";
import { getActiveProfile } from "../../slices/profileSlice";
import {
  CreateUpdateAndFilesAsync,
  getActiveProject,
} from "../../slices/projectSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";
import { theme1 } from "../../theme";

export default function CreateComment() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);

  const activeUpdate = useAppSelector(
    (state) => state.projectSlice.activeUpdate
  );
  // const activeProject = useAppSelector(
  //   (state) => state.projectSlice.activeProject
  // );
  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );

  const [comment, setComment] = useState("");
  const [fieldError, setFieldError] = useState(false);

  const [files, setFiles] = useState<FileList | undefined>(undefined);

  useEffect(() => {
    dispatch(getActiveTeam());
    dispatch(getActiveProfile());
    dispatch(getActiveProject());
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event && event.target && event.target.files) {
      const selectedFiles = event.target.files;
      setFiles(selectedFiles);
    }
  };

  const handleCreateUpdate = async () => {
    if (activeTeam && activeUpdate && activeProfile) {
      setFieldError(false);
      const updateComment: UpdateComment = {
        id: "undefined",
        text: comment,
        profileId: activeProfile?.id,
        projectUpdateId: activeUpdate.id,
        dateCreated: new Date(),
        profileFullName: activeProfile.fullName,
      };

      dispatch(
        CreateUpdateAndFilesAsync({
          updateComment: updateComment,
          files: files,
        })
      );

      navigate("/updateevents");
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
        <Typography variant={isMobile ? "h5" : "h4"}>
          Ny kommentar på uppdatering {activeUpdate?.title}
        </Typography>
        <TextField
          label="Kommentar"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          multiline
          rows={6}
          variant="outlined"
          sx={{ width: "100%", maxWidth: "600px", marginTop: 2 }}
        />
        <Typography>
          Du kan välja flera filer genom att markera flera
        </Typography>
        <label
          htmlFor="file-upload"
          style={{
            display: "inline-block",
            cursor: "pointer",
            backgroundColor: "lightgreen",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          <Typography>Välj filer</Typography>
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        {files && files.length > 0 && (
          <div style={{ marginTop: "10px", width: "100%", maxWidth: "600px" }}>
            <Typography variant="body1">Valda filer:</Typography>
            {Array.from(files).map((file, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <Typography>{file.name}</Typography>
                {file.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      marginTop: "5px",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <Button
          variant="contained"
          onClick={handleCreateUpdate}
          fullWidth={isMobile}
          sx={{
            marginTop: 2,
            color: "white",
            backgroundColor: theme1.palette.primary.main,
          }}
        >
          Spara
        </Button>
      </div>
    </Container>
  );
}
