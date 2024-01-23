import { AppBar } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="flex flex-col h-screen">
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          height: "3rem",
          backdropFilter: "blur(10px)",
        }}
      ></AppBar>

      <main className="bg-neutral-100 flex flex-1 flex-col">
        <Outlet />
      </main>

      <footer className="flex bg-neutral-900"></footer>
    </div>
  );
}
