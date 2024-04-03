import {
  Add as AddIcon,
  ConnectWithoutContact as ConnectWithoutContactIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../../globalConstants";
import { GetMyProfileAsync } from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { GetMyTeamsAsync, setActiveTeam } from "../../slices/teamSlice";

const ChooseTeam = () => {
  //const user = useAppSelector((state) => state.userSlice.user);
  const myTeams = useAppSelector((state) => state.teamSlice.teams);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleNavigateToMenu = (teamId: string) => {
    dispatch(setActiveTeam(teamId));
    dispatch(GetMyProfileAsync(teamId));
    navigate("/enterhouse");
  };

  useEffect(() => {
    dispatch(GetMyTeamsAsync());
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#f7f7f7",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          padding: 2,
          overflowX: "auto",
        }}
      >
        {Array.isArray(myTeams) &&
          myTeams.map((team) => (
            <Card
              key={team.id}
              sx={{
                display: "flex",
                flex: 1,
                backgroundColor: "white",
                borderRadius: 8,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                margin: 2,
              }}
            >
              <CardActionArea
                onClick={() => handleNavigateToMenu(team.id)}
                sx={{ flexGrow: 1 }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    align="center"
                    color="textPrimary"
                    gutterBottom
                  >
                    {team.name.toUpperCase()}
                  </Typography>
                  <Typography
                    variant="body1"
                    align="center"
                    color="textSecondary"
                  >
                    {team.teamRole.toUpperCase()}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
      </Box>
      {/* <Typography variant="h5">
        {" "}
        {user?.firstName.toUpperCase()}'S TEAMS
      </Typography> */}

      <Box sx={{ flex: 0.5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ paddingY: isMobile ? 1 : 2 }}
              fullWidth
              onClick={() => navigate("/createteam")}
              startIcon={<AddIcon />}
            >
              Skapa team
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              sx={{ paddingY: isMobile ? 1 : 2 }}
              color="primary"
              size="large"
              fullWidth
              onClick={() => navigate("/jointeam")}
              startIcon={<ConnectWithoutContactIcon />}
            >
              Gå med i team
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ChooseTeam;
