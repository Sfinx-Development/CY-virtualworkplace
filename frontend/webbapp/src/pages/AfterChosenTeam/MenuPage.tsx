import { Container } from "@mui/material";

export default function Menu() {
  return (
    <Container sx={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        Menu här är alla de valen på sidorna i olika färger  
      </div>
    </Container>
  );
}
