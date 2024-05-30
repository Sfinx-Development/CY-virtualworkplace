import { Box, Button, CardContent, CardMedia, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../globalConstants";
import { theme1 } from "../theme";

interface NavButtonProps {
  backgroundColor?: string;
  borderColor?: string;
  navigationPage: string;
  title?: string;
  icon?: React.ReactNode;
  imageUrl?: string;
  onClick?: () => void;
}

export default function NavButtonCard(props: NavButtonProps) {
  const navigate = useNavigate();

  return (
    <Button
      variant="outlined"
      sx={{
        backgroundColor: "#2e2e2e",
        paddingX: isMobile ? 1 : 3,
        paddingY: isMobile ? 2 : 4,
        borderWidth: "2px",
        borderRadius: 10,
        borderColor: props.borderColor
          ? props.borderColor
          : theme1.palette.primary.main,
        color: "white",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          backgroundColor: "#3e3e3e",
          borderColor: props.borderColor
            ? props.borderColor
            : theme1.palette.primary.main,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          transform: "translateY(-2px)",
        },
        width: isMobile ? 300 : 200,
      }}
      onClick={() => {
        props.onClick ? props.onClick() : navigate(props.navigationPage);
      }}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {props.icon || props.title ? (
          <CardContent
            sx={{
              flex: "1 0 auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              padding: 0,
              "&:last-child": {
                paddingBottom: 0,
              },
            }}
          >
            {props.icon && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 1,
                  fontSize: isMobile ? 24 : 32,
                  color: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "50%",
                  padding: 1,
                }}
              >
                {props.icon}
              </Box>
            )}
            <Typography
              component="div"
              sx={{
                textAlign: "center",
                fontSize: isMobile ? 18 : 20,
                color: "white",
              }}
            >
              {props.title}
            </Typography>
          </CardContent>
        ) : null}
        {props.imageUrl && (
          <CardMedia
            component="img"
            height={isMobile ? "60" : "100"}
            image={props.imageUrl}
            alt={props.title}
            sx={{
              objectFit: "cover",
              borderRadius: "10px",
              marginTop: 2,
              position: "relative",
              "&:after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.3))",
                borderRadius: "10px",
              },
            }}
          />
        )}
      </Box>
    </Button>
  );
}
