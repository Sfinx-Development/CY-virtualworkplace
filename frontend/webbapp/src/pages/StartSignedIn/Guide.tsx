import { Button, Card, Container, Typography } from "@mui/material";
import { useState } from "react";

export default function Guide() {
  const [showStart, setShowStart] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [showMeeting, setShowMeeting] = useState(false);
  const [showProject, setShowProject] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showCustomerService, setShowCustomerService] = useState(false);
  return (
    <Container sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Frågor och svar
      </Typography>
      <Button
        fullWidth
        onClick={() => setShowStart(!showStart)}
        style={{ height: 50, display: "flex", justifyContent: "flex-start" }}
      >
        <Typography>Hur kommer jag igång?</Typography>
      </Button>
      {showStart && (
        <Card sx={{ padding: 2 }}>
          <Typography>
            När du har skapat ett konto och loggat in då behöver du bara ett
            team. Om du har fått en kod och ska gå med i ett team så fyller du i
            vad din roll är i teamet och sedan klistrar in koden nedanför. Om du
            ska skapa ett team för att bjuda in andra (via att dela med sig av
            koden) så väljer du istället 'Skapa team' och fyller i uppgifter som
            gäller. När du klickar in dig på ditt teams meny sedan då kan du
            klicka på koden och då kopieras den. Andra kan använda sig av koden
            för att gå med. På inställningar i mötesrummet kan du välja om du
            vill kräva att godkänna medlemsförfrågningar till ditt team eller om
            det räcker för någon att få ta del av koden för att gå med.
          </Typography>
        </Card>
      )}

      <Button
        fullWidth
        onClick={() => setShowTeam(!showTeam)}
        style={{ height: 50, display: "flex", justifyContent: "flex-start" }}
      >
        <Typography>Hur hanterar jag ett team?</Typography>
      </Button>
      {showTeam && (
        <Card sx={{ padding: 2 }}>
          <Typography>
            När du är medlem i ett team så har du fått en profil. Den är baserad
            på din användare och din roll i det aktuella teamet. Varje team har
            en chatt där alla medlemmar kan skriva med varandra. Inne i
            mötesrummet kan du skapa projekt, undersökningar och möten för alla
            i ditt team. Alla medlemmar tar även del av kalendern som följer med
            ett team och man kan skapa uppgifter som alla kan följa upp.
          </Typography>
        </Card>
      )}

      <Button
        fullWidth
        onClick={() => setShowMeeting(!showMeeting)}
        style={{ height: 50, display: "flex", justifyContent: "flex-start" }}
      >
        <Typography>Hur fungerar möten?</Typography>
      </Button>
      {showMeeting && (
        <Card sx={{ padding: 2 }}>
          <Typography>
            I mötesrummet kan du välja att skapa nytt möte. Detta möte gäller
            automatiskt för alla medlemmar i teamet. När tiden är inne för ditt
            möte då kommer det skrivas ut inne i mötesrummet 'Gå med i
            (mötesnamn)' - när du klickar in dig på länken då hamnar du i ett
            videosamtal där mötet hålls.
          </Typography>
        </Card>
      )}

      <Button
        fullWidth
        onClick={() => setShowProject(!showProject)}
        style={{ height: 50, display: "flex", justifyContent: "flex-start" }}
      >
        <Typography>Hur använder jag projekt?</Typography>
      </Button>
      {showProject && (
        <Card sx={{ padding: 2 }}>
          <Typography>
            I mötesrummet kan du välja att skapa ett nytt projekt. Det kan t.ex.
            vara ett gemensamt mål som ni i teamet strävar mot eller ett projekt
            som ska gå i mål ett visst datum. Andra medlemmar kan sedan skapa
            uppdateringar på projektet där man fyller i vad som har
            uppdaterats/utvecklats och kan bifoga filer så som bilder eller
            dokument. På så sätt kan alla medlemmat i ett team hålla koll på
            projektets gång och utveckling.
          </Typography>
        </Card>
      )}

      <Button
        fullWidth
        onClick={() => setShowDeleteAccount(!showDeleteAccount)}
        style={{ height: 50, display: "flex", justifyContent: "flex-start" }}
      >
        <Typography>Hur raderar jag mitt konto?</Typography>
      </Button>
      {showDeleteAccount && (
        <Card sx={{ padding: 2 }}>
          <Typography>
            Där man väljer sitt team finns det en inställnings-ikon. Där inne är
            dina inställningar för ditt konto och din användare på CY Virtual
            Workplace. Där kan du välja att radera ditt konto och därmed all din
            data permanent.
          </Typography>
        </Card>
      )}
      <Button
        fullWidth
        onClick={() => setShowCustomerService(!showCustomerService)}
        style={{ height: 50, display: "flex", justifyContent: "flex-start" }}
      >
        <Typography>Hur kontaktar jag kundservice?</Typography>
      </Button>
      {showCustomerService && (
        <Card sx={{ padding: 2 }}>
          <Typography>
            Vänligen maila zeroettab@gmail.com för övriga frågor.
          </Typography>
        </Card>
      )}
    </Container>
  );
}
