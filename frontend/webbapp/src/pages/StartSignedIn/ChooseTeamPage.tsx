import AddIcon from "@mui/icons-material/Add";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { GetMyTeamsAsync } from "../../slices/themeSlice";
import { getUserAsync } from "../../slices/userSlice";
import { theme1 } from "../../theme";

export default function ChooseTeam() {
  const user = useAppSelector((state) => state.userSlice.user);
  const myTeams = useAppSelector((state) => state.teamSlice.teams);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const primaryColor = theme1.palette.primary.main;

  const handleNavigateToMenu = (teamId: string) => {
    //hämta saker kanske? nja kanske inte va
    //navigera till teamets meny
    console.log("TEAMID: ", teamId);
    navigate("/menu/" + teamId);
  };

  useEffect(() => {
    //hämtar usern så att den är uppdaterad med jwtn - måste fixa så att om inte usern finns så loggas man ut
    dispatch(getUserAsync());
    dispatch(GetMyTeamsAsync());
    console.log("MY TEAMS:", myTeams);
  }, []);

  return (
    <Container
      sx={{
        padding: "20px",
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
            width: "40%",
            flexDirection: "row",
            justifyContent: "center",
          }}
          onClick={() => navigate("/createteam")}
        >
          <AddIcon sx={{ padding: 1 }} />{" "}
          <Typography sx={{ padding: 1 }}>Skapa team</Typography>
        </Button>

        <Button
          variant="outlined"
          color="primary"
          size="large"
          fullWidth
          style={{
            margin: "10px 0",
            width: "40%",
            flexDirection: "row",
            justifyContent: "center",
          }}
          onClick={() => navigate("/jointeam")}
        >
          <ConnectWithoutContactIcon sx={{ padding: 1 }} />{" "}
          <Typography sx={{ padding: 1 }}>Gå med i team</Typography>
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
        <Typography variant="h4"> Välkommen {user?.firstName}!</Typography>
        {Array.isArray(myTeams) &&
          myTeams?.map((team) => (
            <Card
              key={team.id}
              sx={{
                display: "flex",
                minWidth: "300px",
                backgroundColor: primaryColor,
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
                      variant="h5"
                      sx={{ textAlign: "center" }}
                    >
                      {team.name}{" "}
                    </Typography>
                  </CardContent>
                </Box>
              </CardActionArea>
            </Card>
          ))}
      </div>
    </Container>
  );
}
