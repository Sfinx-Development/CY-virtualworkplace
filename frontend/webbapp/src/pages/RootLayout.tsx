import ComputerIcon from "@mui/icons-material/Computer";
import { AppBar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
export default function RootLayout() {
  const isMobile = window.innerWidth <= 500;
  return (
    <div className="flex flex-col h-screen">
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          height: "3rem",
          flexDirection: "row",
          backdropFilter: "blur(10px)",
          alignItems: "center",
        }}
      >
        <ComputerIcon
          fontSize="large"
          sx={{ paddingRight: 2, paddingLeft: 2 }}
        />
        <Typography variant={isMobile ? "h6" : "h4"}>
          CY Virtual Workplace
        </Typography>
      </AppBar>

      <main className="bg-neutral-100 flex flex-1 flex-col">
        <Outlet />
      </main>

      <footer className="flex bg-neutral-900"></footer>
    </div>
  );
}
