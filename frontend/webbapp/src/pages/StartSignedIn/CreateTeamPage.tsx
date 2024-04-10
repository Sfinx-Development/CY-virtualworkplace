import {
  Button,
  Container,
  ImageList,
  ImageListItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../../globalConstants";
import images, { ImageUrl } from "../../../images";
import { CreateTeamDTO } from "../../../types";
import { useAppDispatch } from "../../slices/store";
import { createTeamAsync } from "../../slices/teamSlice";

export default function CreateTeam() {
  const dispatch = useAppDispatch();
  const [teamName, setTeamName] = useState("");
  const [teamRole, setTeamRole] = useState("");
  const [profileRole, setProfileRole] = useState("");
  const [fieldError, setFieldError] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  const handleCreateTeam = async () => {
    if (
      teamName.trim() !== "" &&
      teamRole.trim() !== "" &&
      profileRole.trim() !== "" &&
      imageUrl.trim() !== ""
    ) {
      setFieldError(false);
      const team: CreateTeamDTO = {
        teamName: teamName,
        teamRole: teamRole,
        profileRole: profileRole,
        imageUrl: imageUrl,
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
      <div style={{ textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Skapa ett nytt team
        </Typography>
        <Typography variant="body1" paragraph>
          Skapa ett nytt team för att samarbeta online och arbeta mot gemensamma
          mål.
        </Typography>
        {fieldError && (
          <Typography variant="body2" color="error">
            Vänligen fyll i alla fält
          </Typography>
        )}
        <TextField
          id="team-name"
          label="Teamnamn"
          variant="outlined"
          sx={{ width: "300px", margin: 2 }}
          onChange={(event) => {
            setTeamName(event.target.value);
          }}
        />
        <Tooltip title="Ange typen av teamet eller avdelningen, t.ex. 'Skolklass', 'Arbetslag', 'Utvecklingsteam' osv.">
          <TextField
            id="team-role"
            label="Typ/avdelning"
            variant="outlined"
            sx={{ width: "300px", margin: 2 }}
            onChange={(event) => {
              setTeamRole(event.target.value);
            }}
          />
        </Tooltip>
        <Tooltip title="Beskriv din roll eller ansvar i teamet. Exempelvis 'Projektledare', 'Utvecklare', 'Designer' etc. Detta hjälper andra att förstå din funktion inom teamet.">
          <TextField
            id="profile-role"
            label="Din roll i teamet"
            variant="outlined"
            sx={{ width: "300px", margin: 2 }}
            onChange={(event) => {
              setProfileRole(event.target.value);
            }}
          />
        </Tooltip>
        <ImageList
          sx={{ width: "100%" }}
          cols={isMobile ? 3 : 6}
          rowHeight={164}
        >
          {images.map((item: ImageUrl) => (
            <ImageListItem key={item.url}>
              <img
                src={item.url}
                alt={item.title}
                loading="lazy"
                style={{
                  height: 160,
                  maxWidth: 180,
                  opacity: imageUrl == item.url ? "0.5" : "1",
                  cursor: "pointer",
                  border: imageUrl === item.url ? "2px solid grey" : "none",
                }}
                onClick={() => setImageUrl(item.url)}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </div>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ paddingY: 2, paddingX: 4, color: "white" }}
          onClick={handleCreateTeam}
        >
          Skapa Team
        </Button>
        <Typography variant="h5" sx={{ marginTop: 5 }} gutterBottom>
          Varför skapa ett team?
        </Typography>
        <Typography variant="body1" paragraph>
          CY erbjuder varje team att skapa projekt där varje medlem kan skapa
          uppdateringar och följa processen från start till mål.
        </Typography>
        <Typography variant="body1" paragraph>
          Varje team har en unik kalender där medlemmar kan hålla koll på vad
          som ska göras.
        </Typography>
        <Typography variant="body1" paragraph>
          Kom igång direkt med att kommunicera med dina kollegor eller vänner
          via CY-chatten.
        </Typography>
        <Typography variant="h5" gutterBottom>
          Hur fungerar det?
        </Typography>
        <Typography variant="body1" paragraph>
          Fyll i detaljerna om ditt team och din roll, och klicka sedan på
          "Skapa Team" för att komma igång.
        </Typography>
        <Typography variant="body1" paragraph>
          När ditt team är skapat kan du bjuda in andra medlemmar och börja
          samarbeta.
        </Typography>
      </div>
    </Container>
  );
}
