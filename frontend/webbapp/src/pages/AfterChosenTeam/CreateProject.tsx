import { Button, Container, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../../globalConstants";
import { Project } from "../../../types";
import { getActiveProfile } from "../../slices/profileSlice";
import { CreateProjectAsync } from "../../slices/projectSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";

export default function CreateProject() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fieldError, setFieldError] = useState(false);

  useEffect(() => {
    dispatch(getActiveTeam());
    dispatch(getActiveProfile());
  }, []);

  const handleCreateProject = async () => {
    if (title !== "" && description !== "" && endDate !== "" && activeTeam) {
      setFieldError(false);

      const parsedEndDate = new Date(endDate);

      const project: Project = {
        id: "undefined",
        title: title,
        description: description,
        endDate: parsedEndDate,
        teamId: activeTeam?.id,
        dateCreated: new Date(),
      };

      await dispatch(CreateProjectAsync(project));

      setEndDate("");
      setTitle("");
      setDescription("");
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
        {/* <Typography variant={isMobile ? "h5" : "h4"}>
          Skapa ett nytt projekt
        </Typography> */}
        {/* <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        > */}
        {/* <Typography
            sx={{ textAlign: "center", fontSize: isMobile ? 15 : 20 }}
          >
            Skapa ett projekt där alla i teamet kan följa processen
          </Typography>
          <Typography
            sx={{ textAlign: "center", fontSize: isMobile ? 15 : 20 }}
          >
            Fyll på med uppdateringar under tidens gång
          </Typography> */}
        {/* </div> */}
        <TextField
          label="Namn på projekt"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          multiline
          variant="outlined"
          sx={{ width: "250px", marginTop: 2 }}
        />
        <TextField
          label="Beskriv projektet"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          variant="outlined"
          sx={{ width: "250px", marginTop: 2 }}
        />

        <TextField
          label="Projekt i mål"
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
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
          onClick={handleCreateProject}
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Skapa
        </Button>
      </div>
    </Container>
  );
}
