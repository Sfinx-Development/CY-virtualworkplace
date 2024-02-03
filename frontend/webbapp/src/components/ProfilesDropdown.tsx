import { Container, Typography } from "@mui/material";
import { useAppSelector } from "../slices/store";

export default function ProfilesDropDown() {
  const profiles = useAppSelector((state) => state.profileSlice.profiles);

  return (
    <Container
      sx={{
        position: "absolute",
        top: "100%",
        left: 0,
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        zIndex: 2,
      }}
    >
      <Typography>Medlemmar i teamet:</Typography>
      {Array.isArray(profiles) &&
        profiles?.map((profile) => (
          <Typography>
            {profile.fullName} - {profile.role}
          </Typography>
        ))}
    </Container>
  );
}
