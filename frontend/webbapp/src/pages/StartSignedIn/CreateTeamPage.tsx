import { Container } from "@mui/material";

export default function CreateTeam() {
  return (
    <Container sx={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        Create team - här skapar du ett team och får en profil för det teamet
      </div>
    </Container>
  );
}
