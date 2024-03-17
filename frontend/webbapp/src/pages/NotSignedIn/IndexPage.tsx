import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function IndexPage() {
  const navigate = useNavigate();

  return (
    <Container
      sx={{
        padding: "20px",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flex: 1,
      }}
    >
      <div
        style={{
          alignItems: "flex-start",
          justifyContent: "flex-start",
          width: "100%",
        }}
      >
        <section style={{ margin: "20px 0" }}>
          <Typography variant="h5" gutterBottom>
            Trött på att använda flera olika verktyg när du kan ha allt på ett
            ställe?
          </Typography>
          <ul>
            <li>Effektivt samarbete</li>
            <li>Säker och tydlig plattform</li>
            <li>Enkel och intuitiv användning</li>
          </ul>
        </section>
        <Button
          variant="contained"
          color="primary"
          size="large"
          style={{ margin: "10px 0", width: "50%" }}
          onClick={() => navigate("/createaccount")}
        >
          Skapa ett konto idag
        </Button>
      </div>

      <img
        alt="two happy girls working by computers"
        width={"100%"}
        src="https://i.imgur.com/3ZY0ydQ.jpeg"
      />

      <div
        style={{
          marginTop: 2,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          width: "100%",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Är du redan en användare?
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          fullWidth
          style={{ margin: "10px 0", width: "50%" }}
          onClick={() => navigate("/signin")}
        >
          Logga in
        </Button>
      </div>
    </Container>
  );
}
