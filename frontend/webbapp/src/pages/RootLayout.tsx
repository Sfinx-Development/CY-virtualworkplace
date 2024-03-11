import ComputerIcon from "@mui/icons-material/Computer";
import { AppBar, Button, Typography } from "@mui/material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../slices/store";
import { logOutUserAsync } from "../slices/userSlice";

const RootLayout = () => {
  const isMobile = window.innerWidth <= 500;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.userSlice.user);
  const handleSignOut = async () => {
    await dispatch(logOutUserAsync()).then(() => {
      navigate("/signin");
    });
  };
  const handleSignIn = async () => {
    navigate("/signin");
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
        <Link
          to={user ? "/chooseteam" : "/"}
          style={{ textDecoration: "none", color: "black" }}
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
            <Typography sx={{ fontSize: isMobile ? 16 : 35 }}>
              CY Virtual Workplace
            </Typography>
          </div>
        </Link>
        {user ? (
          <div>
            {" "}
            <Button
              sx={{ paddingRight: 2, paddingLeft: 2 }}
              onClick={handleSignOut}
            >
              Logga ut
            </Button>{" "}
          </div>
        ) : (
          <div>
            {" "}
            <Button
              sx={{ paddingRight: 2, paddingLeft: 2 }}
              onClick={handleSignIn}
            >
              Logga in
            </Button>{" "}
          </div>
        )}
      </AppBar>

      <main className="bg-neutral-100 flex flex-1 flex-col">
        <Outlet />
      </main>

      <footer className="flex bg-neutral-900"></footer>
    </div>
  );
};

export default RootLayout;
