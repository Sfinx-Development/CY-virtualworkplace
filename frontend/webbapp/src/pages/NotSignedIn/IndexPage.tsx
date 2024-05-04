import { keyframes } from "@emotion/react";
import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../../globalConstants";
import { FormattedMessage } from "react-intl";

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
            <FormattedMessage id="index1" />
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            <FormattedMessage id="index2" />
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
            <FormattedMessage id="index_button_createaccount" />
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
            <FormattedMessage id="index3" />
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
                <FormattedMessage id="index4_title" />
              </Typography>
              <Typography
                variant={isMobile ? "subtitle2" : "body1"}
                gutterBottom
              >
                <FormattedMessage id="index4_sub" />
              </Typography>
            </div>
            <div>
              <Typography variant="h6" gutterBottom>
                <FormattedMessage id="index5_title" />
              </Typography>
              <Typography
                variant={isMobile ? "subtitle2" : "body1"}
                gutterBottom
                style={{ marginLeft: "5px" }}
              >
                <FormattedMessage id="index5_sub" />
              </Typography>
            </div>
            <div>
              <Typography variant="h6" gutterBottom>
                <FormattedMessage id="index6_title" />
              </Typography>
              <Typography
                variant={isMobile ? "subtitle2" : "body1"}
                gutterBottom
                style={{ marginLeft: "5px" }}
              >
                <FormattedMessage id="index6_sub" />
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
            <FormattedMessage id="index7" />
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            fullWidth
            style={{ margin: "20px", borderColor: "#FF6B6B", color: "#FF6B6B" }}
            onClick={() => navigate("/signin")}
          >
            <FormattedMessage id="index_button_signin" />
          </Button>
        </section>
      </Container>
    </div>
  );
};

export default IndexPage;
