import {
  Box,
  Button,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
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
      variant={"outlined"}
      sx={{
        backgroundColor: props.backgroundColor
          ? props.backgroundColor
          : "white",
        padding: 4,
        borderWidth: "2px",
        borderRadius: 10,
        borderColor: props.borderColor
          ? props.borderColor
          : theme1.palette.primary.main,
        color: "black",
        "&:hover": {
          backgroundColor: props.borderColor
            ? props.borderColor
            : theme1.palette.primary.main,
          borderWidth: "3px",
          borderColor: props.borderColor
            ? props.borderColor
            : theme1.palette.primary.main,
        },
        minWidth: 200,
      }}
    >
      <CardActionArea
        onClick={() => {
          props.onClick ? props.onClick() : navigate(props.navigationPage);
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {props.icon || props.title ? (
            <CardContent
              sx={{
                flex: "1 0 auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Typography
                component="div"
                sx={{
                  textAlign: "center",
                  fontSize: isMobile ? "10" : 20,
                  fontWeight: 550,
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
          {props.imageUrl && (
            <CardMedia
              component="img"
              height={isMobile ? "50" : "100"} // Justera höjden här
              image={props.imageUrl}
              alt={props.title}
              sx={{ objectFit: "scale-down", borderRadius: "10px 10px 0 0" }}
            />
          )}
        </Box>
      </CardActionArea>
    </Button>
  );
}
