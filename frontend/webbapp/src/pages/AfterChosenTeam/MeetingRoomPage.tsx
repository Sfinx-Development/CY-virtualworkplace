import { Container } from "@mui/material";

export default function MeetingRoom() {
  return (
    <Container sx={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        MEETINGROOM här hämtar vi från reducern vilket meetingroom, så ska vara
        väldigt generiskt
      </div>
    </Container>
  );
}
