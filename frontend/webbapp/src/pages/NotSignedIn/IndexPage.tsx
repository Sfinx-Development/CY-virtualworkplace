import { keyframes } from "@emotion/react";
import { Box, Button, Container, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../../globalConstants";
import PresentInfo from "../../components/PresentInfo";

const IndexPage = () => {
  const navigate = useNavigate();

  const gradientAnimation = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  `;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(45deg, #333333, #666666)",
        animation: `${gradientAnimation} 10s ease infinite`,
        color: "#FFF",
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "20px" : "40px",
          margin: 0,
          width: "100%",
          flexGrow: 1,
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
          sx={{
            marginY: 4,
            backgroundColor: "#FF6B6B",
            color: "white",
          }}
          onClick={() => navigate("/createaccount")}
        >
          <FormattedMessage id="index_button_createaccount" />
        </Button>
        <div style={{ display: "flex" }}>
          <Box
            component="img"
            src="https://i.imgur.com/3ZY0ydQ.jpeg"
            alt="two happy girls working by computers"
            sx={{
              width: "100%",
              maxWidth: 600,
              borderRadius: 2,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              marginBottom: 4,
              height: 300,
            }}
          />
          <Box
            component="img"
            src="https://www.bareinternational.cl/wp-content/uploads/sites/4/2020/02/Company-cultures-in-remote-offices.jpeg"
            alt="two happy girls working by computers"
            sx={{
              width: 600,
              borderRadius: 2,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              marginBottom: 4,
              maxHeight: 300,
            }}
          />
        </div>
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 4,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-around",
              width: "100%",
              maxWidth: 800,
              marginTop: 2,
            }}
          >
            <PresentInfo titleId="index5_title" descriptionId="index5_sub" />
            <PresentInfo titleId="index4_title" descriptionId="index4_sub" />
            <PresentInfo titleId="index6_title" descriptionId="index6_sub" />
          </Box>
        </Box>

        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
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
            sx={{
              marginTop: 2,
              borderColor: "#FF6B6B",
              color: "#FF6B6B",
            }}
            onClick={() => navigate("/signin")}
          >
            <FormattedMessage id="index_button_signin" />
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default IndexPage;
