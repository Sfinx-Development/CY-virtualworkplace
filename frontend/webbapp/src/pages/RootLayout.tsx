import ComputerIcon from "@mui/icons-material/Computer";
import { AppBar, Button, Typography } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../slices/store";
import { logOutUserAsync } from "../slices/userSlice";

const RootLayout = () => {
  const isMobile = window.innerWidth <= 500;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await dispatch(logOutUserAsync()).then(() => {
      navigate("/signin");
    });
  };
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
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
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
        </div>
        <div>
          <Button
            sx={{ paddingRight: 2, paddingLeft: 2 }}
            onClick={handleSignOut}
          >
            Logga ut
          </Button>
        </div>
      </AppBar>

      <main className="bg-neutral-100 flex flex-1 flex-col">
        <Outlet />
      </main>

      <footer className="flex bg-neutral-900"></footer>
    </div>
  );
};

export default RootLayout;
