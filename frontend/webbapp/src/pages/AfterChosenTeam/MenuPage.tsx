import { Container, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { Team } from "../../../types";
import { useAppSelector } from "../../slices/store";

export default function Menu() {
  const { id } = useParams<{ id: string }>();
  const teams = useAppSelector((state) => state.teamSlice.teams);
  const activeTeam: Team | undefined = teams?.find((t) => String(t.id) === id);
  //sätta activeteam i reducer? ls? koolla det

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
      </div>
    </Container>
  );
}
