import {
  Button,
  Container,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateTeamDTO } from "../../../types";
import { useAppDispatch } from "../../slices/store";
import { createTeamAsync } from "../../slices/teamSlice";

export default function CreateTeam() {
  const dispatch = useAppDispatch();
  const [teamName, setTeamName] = useState("");
  const [teamRole, setTeamRole] = useState("");
  const [profileRole, setProfileRole] = useState("");
  const [fieldError, setFieldError] = useState(false);
  const navigate = useNavigate();

  const handleCreateTeam = async () => {
    if (
      teamName.trim() !== "" &&
      teamRole.trim() !== "" &&
      profileRole.trim() !== ""
    ) {
      setFieldError(false);
      const team: CreateTeamDTO = {
        teamName: teamName,
        teamRole: teamRole,
        profileRole: profileRole,
      };
      await dispatch(createTeamAsync(team)).then(() => {
        navigate("/chooseteam");
      });
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
        <Tooltip title="Ange typen av teamet eller avdelningen, t.ex. 'Skolklass', 'Arbetslag', 'Utvecklingsteam' osv.">
          <TextField
            id="team-role"
            label="Typ/avdelning"
            variant="standard"
            sx={{ width: "250px", marginTop: 2 }}
            onChange={(event) => {
              setTeamRole(event.target.value);
            }}
          />
        </Tooltip>
        <Tooltip title="Beskriv din roll eller ansvar i teamet. Exempelvis 'Projektledare', 'Utvecklare', 'Designer' etc. Detta hjälper andra att förstå din funktion inom teamet.">
          <TextField
            id="firstname"
            label="Din roll i teamet"
            variant="standard"
            sx={{ width: "250px", marginTop: 2 }}
            onChange={(event) => {
              setProfileRole(event.target.value);
            }}
          />
        </Tooltip>
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
