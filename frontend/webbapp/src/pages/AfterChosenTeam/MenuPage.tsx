import { Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Team } from "../../../types";
import { GetTeamProfiles } from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";

export default function Menu() {
  const { id } = useParams<{ id: string }>();
  const teams = useAppSelector((state) => state.teamSlice.teams);
  const profiles = useAppSelector((state) => state.profileSlice.profiles);
  const activeTeam: Team | undefined = teams?.find((t) => String(t.id) === id);
  const dispatch = useAppDispatch();
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
    </Container>
  );
}
