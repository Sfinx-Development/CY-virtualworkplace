import { Container } from "@mui/material";

export default function ChooseTeam() {
  return (
    <Container sx={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        Choose team - här kan du välja vilket team du ska in i eller så klickar
        du på länk "skapa team" och går till createteam eller på länken "gå med
        i team" för att gå med i ett team som finns
      </div>
    </Container>
  );
}
