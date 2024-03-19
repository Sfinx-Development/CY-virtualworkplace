import React from "react";
import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";

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
        overflowX: "hidden", // För att hindra horisontell scrollning
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <section
          style={{
            textAlign: "center",
            marginBottom: "40px",
            color: "#FFF",
          }}
        >
          <Typography variant="h3" gutterBottom>
            Revolutionera din kommunikation
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            En plattform för sömlöst samarbete och kommunikation
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            style={{ margin: "20px", backgroundColor: "#FF6B6B" }}
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
          <Typography variant="h4" gutterBottom>
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
              <Typography variant="body1" gutterBottom>
                Arbeta smidigt tillsammans oavsett var ni är.
              </Typography>
            </div>
            <div>
              <Typography variant="h6" gutterBottom>
                Säker och pålitlig
              </Typography>
              <Typography variant="body1" gutterBottom>
                Din data är säker och skyddad hos oss.
              </Typography>
            </div>
            <div>
              <Typography variant="h6" gutterBottom>
                Enkel användning
              </Typography>
              <Typography variant="body1" gutterBottom>
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
          }}
        >
          <Typography variant="h4" gutterBottom>
            Redan en användare?
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
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

