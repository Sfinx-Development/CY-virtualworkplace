import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../globalConstants";

interface NavCardProps {
  backgroundColor: string;
  navigationPage: string;
  title: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export default function NavCard(props: NavCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        display: "flex",
        minWidth: isMobile ? "120px" : "200px",
        backgroundColor: props.backgroundColor,
      }}
    >
      <CardActionArea
        onClick={() => {
          props.onClick ? props.onClick() : navigate(props.navigationPage);
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography
              component="div"
              sx={{
                textAlign: "center",
                fontSize: isMobile ? "10" : "22",
              }}
            >
              {props.title}
            </Typography>
            {props.icon ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {props.icon}
              </Box>
            ) : null}
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
}
