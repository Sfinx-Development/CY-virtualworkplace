import { Container } from "@mui/material";

export default function ChatRoom() {
  return (
    <Container sx={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        Chat room här kan du chatta med dina team medlemmar (profilerna)
      </div>
    </Container>
  );
}
