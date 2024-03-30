import { Button, Container, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../../globalConstants";
import { ProjectUpdate, UpdateComment } from "../../../types";
import { getActiveProfile } from "../../slices/profileSlice";
import {
  CreateProjectUpdateAsync,
  getActiveProject,
} from "../../slices/projectSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";

export default function CreateUpdate() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);
  const activeProject = useAppSelector(
    (state) => state.projectSlice.activeProject
  );

  const activeProfile = useAppSelector(
    (state) => state.profileSlice.activeProfile
  );

  const [comment, setComment] = useState("");
  const [fieldError, setFieldError] = useState(false);

  useEffect(() => {
    dispatch(getActiveTeam());
    dispatch(getActiveProfile());
    dispatch(getActiveProject());
  }, []);

  const handleCreateUpdate = async () => {
    if (activeTeam && activeProject && activeProfile) {
      setFieldError(false);

      const update: ProjectUpdate = {
        id: "undefined",
        projectId: activeProject.id,
        dateCreated: new Date(),
        version: 0,
      };

      const updateComment: UpdateComment = {
        id: "undefined",
        text: comment,
        profileId: activeProfile?.id,
        projectUpdateId: "undefined",
        dateCreated: new Date(),
      };

      await dispatch(
        CreateProjectUpdateAsync({
          updateComment: updateComment,
          projectUpdate: update,
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        ></div>
        <TextField
          label="Kommentar"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          multiline
          variant="outlined"
          sx={{ width: "250px", marginTop: 2 }}
        />

        <Button
          variant="contained"
          onClick={handleCreateUpdate}
          sx={{ marginTop: 2 }}
        >
          Spara
        </Button>
      </div>
    </Container>
  );
}
