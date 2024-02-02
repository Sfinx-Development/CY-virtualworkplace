import { Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { CreateTeamDTO } from "../../../types";
import { useAppDispatch } from "../../slices/store";
import { createTeamAsync } from "../../slices/themeSlice";

export default function CreateTeam() {
  const dispatch = useAppDispatch();
  const [teamName, setTeamName] = useState("");
  const [teamRole, setTeamRole] = useState("");
  const [profileRole, setProfileRole] = useState("");
  const [fieldError, setFieldError] = useState(false);

  const handleCreateTeam = async () => {
    if (teamName != "" && teamRole != "" && profileRole != "") {
      setFieldError(false);
      const team: CreateTeamDTO = {
        teamName: teamName,
        teamRole: teamRole,
        profileRole: profileRole,
      };
      await dispatch(createTeamAsync(team));
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
        {fieldError ? (
          <Typography>Alla fält måste vara ifyllda</Typography>
        ) : null}
        <TextField
          id="firstname"
          label="Namn på team"
          variant="standard"
          sx={{ width: "250px", marginTop: 2 }}
          onChange={(event) => {
            setTeamName(event.target.value);
          }}
        />
        <TextField
          id="firstname"
          label="Typ/avdelning"
          variant="standard"
          sx={{ width: "250px", marginTop: 2 }}
          onChange={(event) => {
            setTeamRole(event.target.value);
          }}
        />
        <TextField
          id="firstname"
          label="Din roll i teamet"
          variant="standard"
          sx={{ width: "250px", marginTop: 2 }}
          onChange={(event) => {
            setProfileRole(event.target.value);
          }}
        />
        <Button
          variant="contained"
          sx={{
            marginTop: 4,
            marginBottom: 1,
            paddingRight: 5,
            paddingLeft: 5,
          }}
          onClick={handleCreateTeam}
        >
          Skapa Team
        </Button>
      </div>
    </Container>
  );
}
