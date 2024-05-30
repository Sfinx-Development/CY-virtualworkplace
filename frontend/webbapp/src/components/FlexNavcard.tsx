import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../globalConstants";

interface NavCardProps {
  backgroundColor?: string;
  navigationPage?: string;
  title?: string;
  icon?: React.ReactNode;
  imageUrl?: string;
  onClick?: () => void;
}

export default function FlexNavcard(props: NavCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (props.onClick) {
      props.onClick();
    } else if (props.navigationPage) {
      navigate(props.navigationPage);
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        flex: 1,
        backgroundColor: "transparent",
        borderColor: "rgba(255,255,255,0.1)",
        maxHeight: 90,
        borderRadius: 10,
      }}
    >
      <CardActionArea onClick={handleClick}>
        {props.imageUrl && (
          <CardMedia
            component="img"
            height={isMobile ? "100" : "140"}
            image={props.imageUrl}
            alt={props.title}
          />
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "center",
            paddingBottom: 0,
          }}
        >
          {(props.icon || props.title) && (
            <CardContent
              sx={{
                flex: "1",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 1,
                boxShadow: 0.5,
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 10,
                paddingTop: 2,
                position: "relative",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              {props.icon && (
                <Box
                  sx={{
                    position: "absolute",
                    left: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 40,
                    width: 40,
                    borderRadius: "50%",
                    color: "white",
                    border: "2px solid white",
                  }}
                >
                  {props.icon}
                </Box>
              )}
              <Typography
                component="div"
                sx={{
                  textAlign: "center",
                  fontSize: isMobile ? 20 : 25,
                  color: "white",
                  flexGrow: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {props.title}
              </Typography>
            </CardContent>
          )}
        </Box>
      </CardActionArea>
    </Card>
  );
}
