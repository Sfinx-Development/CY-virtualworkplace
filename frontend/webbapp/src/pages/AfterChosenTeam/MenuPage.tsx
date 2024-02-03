import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Team } from "../../../types";
import { GetTeamProfiles } from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { theme1 } from "../../theme";

export default function Menu() {
  const { id } = useParams<{ id: string }>();
  const teams = useAppSelector((state) => state.teamSlice.teams);
  const profiles = useAppSelector((state) => state.profileSlice.profiles);
  const activeTeam: Team | undefined = teams?.find((t) => String(t.id) === id);
  // const primaryColor = theme1.palette.primary.main;
  const officeColor = theme1.palette.office.main;
  const meetingRoomColor = theme1.palette.room.main;
  const chatRoomColor = theme1.palette.chat.main;
  const leaveColor = theme1.palette.leave.main;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  //sätta activeteam i reducer? ls? koolla det
  useEffect(() => {
    if (id) {
      dispatch(GetTeamProfiles(id));
    }
  }, [id]);

  return (
    <Container sx={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        Menu här är alla de valen på sidorna i olika färger
        <Typography variant={"h4"}>TEAM: {activeTeam?.name}</Typography>
        <Typography>Medlemmar i teamet:</Typography>
        {Array.isArray(profiles) &&
          profiles?.map((profile) => (
            <Typography>
              {profile.fullName} - {profile.role}
            </Typography>
          ))}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ flexDirection: "column" }}>
          <Card
            sx={{
              display: "flex",
              minWidth: "300px",
              marginTop: 4,
              marginBottom: 4,
              backgroundColor: meetingRoomColor,
            }}
          >
            <CardActionArea
              onClick={() => {
                navigate("/meetingroom");
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Typography
                    component="div"
                    variant="h5"
                    sx={{ textAlign: "center" }}
                  >
                    Mötesrum
                  </Typography>
                </CardContent>
              </Box>
            </CardActionArea>
          </Card>

          <Card
            sx={{
              display: "flex",
              minWidth: "300px",
              backgroundColor: chatRoomColor,
            }}
          >
            <CardActionArea
              onClick={() => {
                navigate("/chatroom");
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Typography
                    component="div"
                    variant="h5"
                    sx={{ textAlign: "center" }}
                  >
                    Chattrum
                  </Typography>
                </CardContent>
              </Box>
            </CardActionArea>
          </Card>
        </div>
        <div
          style={{
            flexDirection: "column",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Card
            sx={{
              display: "flex",
              minWidth: "300px",
              marginTop: 4,
              marginBottom: 4,
              backgroundColor: officeColor,
            }}
          >
            <CardActionArea
              onClick={() => {
                navigate("/office");
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Typography
                    component="div"
                    variant="h5"
                    sx={{ textAlign: "center" }}
                  >
                    Mitt Kontor
                  </Typography>
                </CardContent>
              </Box>
            </CardActionArea>
          </Card>
          <Card
            sx={{
              display: "flex",
              minWidth: "300px",
              backgroundColor: leaveColor,
            }}
          >
            <CardActionArea
              onClick={() => {
                navigate("/chooseteam");
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Typography
                    component="div"
                    variant="h5"
                    sx={{ textAlign: "center" }}
                  >
                    Lämna
                  </Typography>
                </CardContent>
              </Box>
            </CardActionArea>
          </Card>
        </div>
      </div>
    </Container>
  );
}
