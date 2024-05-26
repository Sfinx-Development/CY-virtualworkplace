import { Box, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

interface PresentInfoType {
  titleId: string;
  descriptionId: string;
}

export default function PresentInfo(props: PresentInfoType) {
  return (
    <Box
      key={props.titleId}
      sx={{
        flex: 1,
        padding: 2,
        margin: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        position: "relative",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        borderRadius: 2,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
        },
        background: "linear-gradient(135deg, #ff6b6b, #f06595)",
      }}
    >
      <Box
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          borderRadius: 2,
          padding: 3,
          textAlign: "center",
          width: "80%",
          maxWidth: "320px",
        }}
      >
        <Typography variant="h6" color="black" gutterBottom>
          <FormattedMessage id={props.titleId} />
        </Typography>
        <Typography variant="body2" color="black">
          <FormattedMessage id={props.descriptionId} />
        </Typography>
      </Box>
    </Box>
  );
}
