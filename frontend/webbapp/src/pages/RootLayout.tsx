import ComputerIcon from "@mui/icons-material/Computer";
import {
  AppBar,
  Button,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { isMobile } from "../../globalConstants";
import { useLanguageContext } from "../contexts/languageContext";
import { useAppDispatch, useAppSelector } from "../slices/store";
import { logOutUserAsync } from "../slices/userSlice";

const RootLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.userSlice.user);
  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);
  const { language, setLanguage } = useLanguageContext();
  const handleSignOut = async () => {
    await dispatch(logOutUserAsync()).then(() => {
      navigate("/signin");
    });
  };
  const handleSignIn = async () => {
    navigate("/signin");
  };
  const languageChoices: string[] = ["sv", "en"];
  const handleLanguageChoice = (newLanguage: string) => {
    setLanguage(newLanguage);
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
          {isMobile ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <ComputerIcon
                fontSize="large"
                sx={{ paddingRight: 1, paddingLeft: 2 }}
              />
              <Typography sx={{ fontSize: isMobile ? 20 : 35 }}>CY</Typography>
            </div>
          ) : (
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
          )}
        </Link>
        <div style={{ display: "flex", alignItems: "center" }}>
          {activeTeam ? (
            <Link
              to={"/menu"}
              style={{ textDecoration: "none", color: "black" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    padding: 1,
                  }}
                >
                  <Typography sx={{ fontSize: isMobile ? 14 : 15 }}>
                    {activeTeam.name}
                  </Typography>
                </Button>
              </div>
            </Link>
          ) : null}

          {user ? (
            <div>
              {" "}
              <Button
                sx={{ paddingRight: 2, paddingLeft: 2 }}
                onClick={handleSignOut}
              >
                <Typography fontSize={isMobile ? 13 : 15}>Logga ut</Typography>
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
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={language}
              onChange={(event) => handleLanguageChoice(event.target.value)}
            >
              {languageChoices.map((m, index) => (
                <MenuItem key={index} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </AppBar>

      <main className="bg-neutral-100 flex flex-1 flex-col w-full">
        <Outlet />
      </main>

      <footer className="flex bg-neutral-900"></footer>
    </div>
  );
};

export default RootLayout;
