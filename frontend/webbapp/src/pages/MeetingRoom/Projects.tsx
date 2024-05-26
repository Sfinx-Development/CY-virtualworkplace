import { Box, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { is800Mobile, isMobile } from "../../../globalConstants";
import ProgressBar from "../../components/ProgressBar";
import { GetTeamProfiles, getActiveProfile } from "../../slices/profileSlice";
import { GetTeamProjectsAsync } from "../../slices/projectSlice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import { getActiveTeam } from "../../slices/teamSlice";

export default function Projects() {
  const projects = useAppSelector((state) => state.projectSlice.projects);
  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (activeTeam) {
      dispatch(GetTeamProfiles(activeTeam?.id));
      dispatch(GetTeamProjectsAsync(activeTeam.id));
    }
  }, [activeTeam]);

  useEffect(() => {
    dispatch(getActiveTeam());
    dispatch(getActiveProfile());
  }, []);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Container
        sx={{
          marginTop: isMobile ? 1 : 2,
          maxHeight: is800Mobile ? "350px" : "300px",
          width: "100%",
          overflow: "auto",
          marginLeft: 0,
        }}
        className="project-list-container"
      >
        {projects && projects?.length > 0 ? (
          <Box>
            {projects.map((p) => (
              <ProgressBar project={p} key={p.id} />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: 4,
              backgroundColor: "#f5f5f5",
              borderRadius: 2,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              marginTop: 2,
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Det finns inget projekt för detta teamet ännu.
            </Typography>
          </Box>
        )}
      </Container>
    </div>
  );
}
