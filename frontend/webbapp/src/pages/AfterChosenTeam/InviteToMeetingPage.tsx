import { Container } from "@mui/material";

export default function InviteToMeeting() {
  return (
    <Container sx={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        Invite en profil till meeting som finns om du är ägaren av mötet
      </div>
    </Container>
  );
}
