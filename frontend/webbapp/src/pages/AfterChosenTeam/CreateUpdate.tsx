import { Button, Container, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../../globalConstants";
import { ProjectUpdate, UpdateComment } from "../../../types";
import { getActiveProfile } from "../../slices/profileSlice";
import {
  CreateProjectUpdateAsync,
  getActiveProject,
} from "../../slices/projectSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { theme1 } from "../../theme";

export default function CreateUpdate() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const activeProject = useAppSelector(
    (state) => state.projectSlice.activeProject
  );
  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );

  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [fieldError, setFieldError] = useState(false);

  const [files, setFiles] = useState<FileList | undefined>(undefined);

  useEffect(() => {
    dispatch(getActiveProfile());
    dispatch(getActiveProject());
  }, []);
  useEffect(() => {
    console.log("AKTIVT PROJEKT: ", activeProject);
    console.log("AKTIVT PROFIL: ", activeProfile);
  }, [activeProfile]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event && event.target && event.target.files) {
      const selectedFiles = event.target.files;
      setFiles(selectedFiles);
    }
  };

  const handleCreateUpdate = async () => {
    console.log("AKTIVT PROJEKT: ", activeProject);
    console.log("AKTIVT PROFIL: ", activeProfile);
    if (activeProject && activeProfile && comment && title) {
      setFieldError(false);

      const update: ProjectUpdate = {
        id: "undefined",
        title: title,
        projectId: activeProject.id,
        dateCreated: new Date(),
        version: 0,
      };

      const updateComment: UpdateComment = {
        id: "undefined",
        text: comment,
        profileId: activeProfile.id,
        projectUpdateId: "undefined",
        dateCreated: new Date(),
        profileFullName: activeProfile.fullName,
      };

      await dispatch(
        CreateProjectUpdateAsync({
          updateComment: updateComment,
          projectUpdate: update,
          files: files,
        })
      );

      navigate("/menu");
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
          Ny uppdatering på {activeProject?.title}
        </Typography>
        <TextField
          label="Titel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="outlined"
          sx={{ width: "100%", maxWidth: "600px", marginTop: 2 }}
        />
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
