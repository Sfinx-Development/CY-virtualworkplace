import {
  Add as AddIcon,
  ConnectWithoutContact as ConnectWithoutContactIcon,
} from "@mui/icons-material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { FormattedMessage } from "react-intl";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "../../../globalConstants";
import { GetMyProfileAsync } from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import {
  DeleteTeamRequest,
  GetMyTeamRequestsAsync,
  GetMyTeamsAsync,
  setActiveTeam,
} from "../../slices/teamSlice";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const ChooseTeam = () => {
  //const user = useAppSelector((state) => state.userSlice.user);
  const myTeams = useAppSelector((state) => state.teamSlice.teams);
  const myRequests = useAppSelector(
    (state) => state.teamSlice.myRequests
  )?.filter((r) => !r.isConfirmed);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleNavigateToMenu = (teamId: string) => {
    dispatch(setActiveTeam(teamId));
    dispatch(GetMyProfileAsync(teamId));
    navigate("/enterhouse");
  };

  useEffect(() => {
    dispatch(GetMyTeamsAsync());
    dispatch(GetMyTeamRequestsAsync());
  }, []);

  const deleteRequest = (requestId: string) => {
    dispatch(DeleteTeamRequest(requestId));
  };

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
      <IconButton
        sx={{ position: "absolute", top: 10, right: 215, color: "grey" }}
        onClick={() => {
          navigate("/guide");
        }}
      >
        <HelpOutlineIcon />
      </IconButton>

      <IconButton
        sx={{ position: "absolute", top: 10, right: 180 }}
        onClick={() => {
          navigate("/usersettings");
        }}
      >
        <SettingsOutlinedIcon />
      </IconButton>
      <Box sx={{ marginTop: 3 }}>
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
        
              <FormattedMessage id="choose_team_page1" />
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
             
              <FormattedMessage id="choose_team_page" />
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={2}>
          {Array.isArray(myTeams) &&
            myTeams.map((team) => (
              <Grid key={team.id} item xs={12} sm={6} md={3}>
                <Container maxWidth="xs">
                  <Box
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "16px",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                      height: "100%",
                    }}
                  >
                    <Card sx={{ height: "100%", border: "20px solid white" }}>
                      <CardActionArea
                        onClick={() => handleNavigateToMenu(team.id)}
                      >
                        {team.imageUrl ? (
                          <CardMedia
                            component="img"
                            height="280"
                            image={team.imageUrl}
                            alt={team.name}
                          />
                        ) : (
                          <CardMedia
                            component="img"
                            height="280"
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
                  </Box>
                </Container>
              </Grid>
            ))}
          {Array.isArray(myRequests) &&
            myRequests.map((request) => (
              <Grid key={request.id} item xs={12} sm={6} md={3}>
                <Container maxWidth="xs">
                  <Box
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "16px",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                      height: "100%",
                    }}
                  >
                    <Card sx={{ height: "100%", border: "20px solid white" }}>
                      <CardMedia
                        component="img"
                        height="260"
                        image={"https://i.imgur.com/Z29mJ8s.png"}
                        alt={request.teamName}
                      />
                      <CardContent>
                        <Typography
                          variant="h6"
                          align="center"
                          color="textPrimary"
                          gutterBottom
                        >
                          {request.teamName.toUpperCase()}
                        </Typography>
                        <Button onClick={() => deleteRequest(request.id)}>
                       
                          <FormattedMessage id="choose_team_page2regret" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Box>
                </Container>
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ChooseTeam;
