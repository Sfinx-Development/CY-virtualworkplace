import {
  Box,
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

export default function ChooseTeam() {
  const user = useAppSelector((state) => state.userSlice.user);
  const myTeams = useAppSelector((state) => state.teamSlice.teams);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleNavigateToMenu = (teamId: string) => {
    //hämta saker kanske? nja kanske inte va
    //navigera till teamets meny
    console.log("TEAMID: ", teamId);
    navigate("/menu/" + teamId);
  };

  useEffect(() => {
    // dispatch(GetMyTeamsAsync());
    dispatch(GetMyTeamsAsync());
    console.log("MY TEAMS:", myTeams);
  }, []);

  return (
    <Container sx={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography> Hej {user?.firstName}</Typography>
        Choose team - här kan du välja vilket team du ska in i eller så klickar
        du på länk "skapa team" och går till createteam eller på länken "gå med
        i team" för att gå med i ett team som finns
        {Array.isArray(myTeams) &&
          myTeams?.map((team) => (
            <Card key={team.id} sx={{ display: "flex" }}>
              <CardActionArea
                onClick={() => {
                  handleNavigateToMenu(team.id);
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flex: "1 0 auto" }}>
                    <Typography component="div" variant="h5">
                      HEJ {team.name}{" "}
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
