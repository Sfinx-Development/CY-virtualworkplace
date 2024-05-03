import { keyframes } from "@emotion/react";
import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../../globalConstants";

const IndexPage = () => {
  const navigate = useNavigate();

  // Keyframes för bakgrundsanimering
  const gradientAnimation = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  `;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        background: "linear-gradient(45deg, #333333, #666666)",
        animation: `${gradientAnimation} 10s ease infinite`,
        color: "#FFF",
        overflowX: "hidden",
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "20px 10px" : "40px 20px",
        }}
      >
        <section
          style={{
            textAlign: "center",
            marginBottom: isMobile ? "0px" : "40px",
            color: "#FFF",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant={isMobile ? "h5" : "h3"} gutterBottom>
            Revolutionera din kommunikation
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            En plattform för sömlöst samarbete och kommunikation
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            style={{
              margin: isMobile ? "30px" : "20px",
              backgroundColor: "#FF6B6B",
              color: "white",
            }}
            onClick={() => navigate("/createaccount")}
          >
            Börja nu
          </Button>
        </section>

        <img
          src="https://i.imgur.com/3ZY0ydQ.jpeg"
          alt="two happy girls working by computers"
          style={{
            width: "100%",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        />

        <section
          style={{
            textAlign: "center",
            marginTop: "40px",
            color: "#FFF",
          }}
        >
          <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
            Varför välja oss?
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "20px",
            }}
          >
            <div>
              <Typography variant="h6" gutterBottom>
                Effektivt samarbete
              </Typography>
              <Typography
                variant={isMobile ? "subtitle2" : "body1"}
                gutterBottom
              >
                Arbeta smidigt tillsammans oavsett var ni är.
              </Typography>
            </div>
            <div>
              <Typography variant="h6" gutterBottom>
                Säker och pålitlig
              </Typography>
              <Typography
                variant={isMobile ? "subtitle2" : "body1"}
                gutterBottom
                style={{ marginLeft: "5px" }}
              >
                Din data är säker och skyddad hos oss.
              </Typography>
            </div>
            <div>
              <Typography variant="h6" gutterBottom>
                Enkel användning
              </Typography>
              <Typography
                variant={isMobile ? "subtitle2" : "body1"}
                gutterBottom
                style={{ marginLeft: "5px" }}
              >
                Intuitivt gränssnitt för alla användare.
              </Typography>
            </div>
          </div>
        </section>

        <section
          style={{
            textAlign: "center",
            marginTop: "40px",
            color: "#FFF",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant={isMobile ? "h6" : "h4"} gutterBottom>
            Redan en användare?
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            fullWidth
            style={{ margin: "20px", borderColor: "#FF6B6B", color: "#FF6B6B" }}
            onClick={() => navigate("/signin")}
          >
            Logga in här
          </Button>
        </section>
      </Container>
    </div>
  );
};

export default IndexPage;
