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
  navigationPage: string;
  title?: string;
  icon?: React.ReactNode;
  imageUrl?: string;
  onClick?: () => void;
}

export default function FlexNavcard(props: NavCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        display: "flex",
        flex: 1,
        backgroundColor: props.backgroundColor,
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
            height={isMobile ? "100" : "140"}
            image={props.imageUrl}
            alt={props.title}
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
                  fontSize: isMobile ? "10" : "22",
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
    </Card>
  );
}
