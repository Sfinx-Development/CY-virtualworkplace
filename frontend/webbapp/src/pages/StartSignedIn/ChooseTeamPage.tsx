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
  CardMedia,
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
      <Box sx={{ marginTop: 2 }}>
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
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          padding: 2,
          flexWrap: "wrap",
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
                maxHeight: "250px",
                minWidth: "250px",
                maxWidth: "300px",
                borderRadius: 8,
                margin: 2,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardActionArea
                onClick={() => handleNavigateToMenu(team.id)}
                sx={{ flexGrow: 1 }}
              >
                {team.imageUrl ? (
                  <CardMedia
                    component="img"
                    height="150px"
                    image={team.imageUrl}
                    alt={team.name}
                  />
                ) : (
                  <CardMedia
                    component="img"
                    height="120"
                    image={"https://i.imgur.com/Z29mJ8s.png"}
                    alt={team.name}
                  />
                )}

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
    </Box>
  );
};

export default ChooseTeam;
