import AddIcon from "@mui/icons-material/Add";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  keyframes,
} from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../../globalConstants";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { GetMyTeamsAsync, setActiveTeam } from "../../slices/teamSlice";
// import { theme1 } from "../../theme";

export default function ChooseTeam() {
  const user = useAppSelector((state) => state.userSlice.user);
  const myTeams = useAppSelector((state) => state.teamSlice.teams);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const primaryColor = theme1.palette.primary.main;

  const handleNavigateToMenu = (teamId: string) => {
    dispatch(setActiveTeam(teamId));
    navigate("/enterhouse");
  };

  useEffect(() => {
    dispatch(GetMyTeamsAsync());
  }, []);

  //göra dessa globala också sen - global stil?
  const gradientAnimation = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  `;

  return (
    <div
      style={{
        padding: isMobile ? 0 : "20px",
        height: "100vh",
        width: "100%",
        background: "linear-gradient(45deg, #333333, #666666)",
        animation: `${gradientAnimation} 10s ease infinite`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          size="large"
          fullWidth
          style={{
            margin: "10px 0",
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
          }}
          onClick={() => navigate("/createteam")}
        >
          <AddIcon sx={{ padding: 0.5 }} />{" "}
          <Typography sx={{ padding: 0.5 }}>Skapa team</Typography>
        </Button>

        <Button
          variant="outlined"
          color="primary"
          size="large"
          fullWidth
          style={{
            margin: "10px 10px",
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
          }}
          onClick={() => navigate("/jointeam")}
        >
          <ConnectWithoutContactIcon sx={{ padding: 0.5 }} />{" "}
          <Typography sx={{ padding: 0.5 }}>Gå med i team</Typography>
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          alignItems: "center",
        }}
      >
        <Typography variant="h5"> Välkommen {user?.firstName}!</Typography>
        {Array.isArray(myTeams) &&
          myTeams?.map((team) => (
            <Card
              key={team.id}
              sx={{
                display: "flex",
                minWidth: isMobile ? "200px" : "300px",
                backgroundColor: "#CDCDCB",
              }}
            >
              <CardActionArea
                onClick={() => {
                  handleNavigateToMenu(team.id);
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flex: "1 0 auto" }}>
                    <Typography
                      component="div"
                      variant="h6"
                      sx={{
                        textAlign: "center",
                        color: "black",
                      }}
                    >
                      {team.name}{" "}
                    </Typography>
                  </CardContent>
                </Box>
              </CardActionArea>
            </Card>
          ))}
      </div>
    </div>
  );
}
