import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  keyframes,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../globalConstants";

interface NavCardProps {
  backgroundColor?: string;
  navigationPage: string;
  title?: string;
  icon?: React.ReactNode;
  imageUrl?: string;
  onClick?: () => void;
}

export default function NavCard(props: NavCardProps) {
  const navigate = useNavigate();

  const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minWidth: isMobile ? "300px" : "200px",
        height: isMobile ? "200px" : "150px",
        borderRadius: "10px",
        backgroundColor: "white", // Vit bakgrundsfärg
        boxShadow: "0 1px 5px #FF6B6B", // Skugga för 3D-effekt
        transition: "transform 0.2s ease, border-color 0.2s ease", // Lägg till transition för border-color
        border: "4px solid", // Använd en solid border
        backgroundImage: "linear-gradient(45deg, white, #FF6B6B)", // Gradient för border
        backgroundClip: "padding-box", // Sätt bakgrundens ursprung till "padding-box"
        padding: "4px", // Lägg till padding för att skilja border från innehåll
      }}
    >
      <CardActionArea
        onClick={() => {
          props.onClick ? props.onClick() : navigate(props.navigationPage);
        }}
      >
        {props.imageUrl && (
          <CardMedia
            component="img"
            height={isMobile ? "50" : "100"} // Justera höjden här
            image={props.imageUrl}
            alt={props.title}
            sx={{ objectFit: "scale-down", borderRadius: "10px 10px 0 0" }}
          />
        )}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {props.icon || props.title ? (
            <CardContent
              sx={{
                flex: "1 0 auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: isMobile ? "row" : "column",
              }}
            >
              <Typography
                component="div"
                sx={{
                  textAlign: "center",
                  fontSize: isMobile ? "10" : 20,
                }}
              >
                {props.title}
              </Typography>
              {props.icon ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginLeft: isMobile ? 1 : 0,
                  }}
                >
                  {props.icon}
                </Box>
              ) : null}
            </CardContent>
          ) : null}
        </Box>
      </CardActionArea>
    </div>
  );
}
