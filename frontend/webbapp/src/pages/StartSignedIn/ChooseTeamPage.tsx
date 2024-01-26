import { Container, Typography } from "@mui/material";
import { useAppSelector } from "../../slices/store";

export default function ChooseTeam() {
  const user = useAppSelector((state) => state.userSlice.user);
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
      </div>
    </Container>
  );
}
