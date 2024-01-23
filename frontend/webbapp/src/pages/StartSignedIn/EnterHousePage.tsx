import { Container } from "@mui/material";

export default function EnterHouse() {
  return (
    <Container sx={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        Enter house - när du valt team att gå in till så öppnas denna dörren här
        då?
      </div>
    </Container>
  );
}
