import ComputerIcon from "@mui/icons-material/Computer";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  AppBar,
  Button,
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { isMobile } from "../../globalConstants";
import { ProfileHubDTO } from "../../types";
import { useLanguageContext } from "../contexts/languageContext";
import { useAppDispatch, useAppSelector } from "../slices/store";
import { logOutUserAsync } from "../slices/userSlice";

const RootLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.userSlice.user);
  const activeTeam = useAppSelector((state) => state.teamSlice.activeTeam);
  const { language, setLanguage } = useLanguageContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const onlineProfiles = useAppSelector(
    (state) => state.profileSlice.onlineProfiles
  );

  const handleSignOut = async () => {
    await dispatch(logOutUserAsync()).then(() => {
      navigate("/signin");
    });
  };
  const handleSignIn = async () => {
    navigate("/signin");
  };
  const languageChoices: [string, string][] = [
    ["https://i.imgur.com/t7SbmDF.png", "sv"],
    ["https://i.imgur.com/pDGraHD.png", "en"],
  ];
  const handleLanguageChoice = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const toggleOnlineList = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: "100vh",
        alignItems: "center",
        width: "100%",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      }}
    >
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          height: "4rem",
          flexDirection: "row",
          backdropFilter: "blur(10px)",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
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
          {isMobile || !activeTeam ? null : (
            <IconButton
              onClick={toggleOnlineList}
              sx={{ marginRight: "160px" }}
            >
              <Typography variant="body2">Medlemmar online</Typography>
              <ArrowDropDownIcon sx={{ transform: "rotate(-1eg)" }} />
            </IconButton>
          )}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {onlineProfiles && onlineProfiles.length > 0 ? (
              onlineProfiles.map((profile: ProfileHubDTO) => (
                <MenuItem key={profile.profileId} onClick={handleClose}>
                  <FiberManualRecordIcon sx={{ color: "lightgreen" }} />
                  <Typography>{profile.fullName}</Typography>
                </MenuItem>
              ))
            ) : (
              <MenuItem onClick={handleClose}>
                <Typography>Ingen profil online</Typography>
              </MenuItem>
            )}
          </Menu>
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
                  <Typography sx={{ fontSize: isMobile ? 13 : 15 }}>
                    Mitt Team
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
          <FormControl sx={{ "& .MuiOutlinedInput-root": { border: "none" } }}>
            <Select
              sx={{
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
                "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    border: 0,
                  },
              }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={language}
              onChange={(event) => handleLanguageChoice(event.target.value)}
            >
              {languageChoices.map((m, index) => (
                <MenuItem key={index} value={m[1]}>
                  <img
                    src={m[0]}
                    alt={`Flag for ${m[1]}`}
                    style={{
                      marginRight: "2px",
                      width: "20px",
                      height: "15px",
                    }}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </AppBar>

      <main
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flex: 1,
          flexGrow: 1,
          flexDirection: "column",
          justifyContent: "center",
          padding: 0,
          margin: 0,
          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </main>

      <footer className="flex bg-neutral-900"></footer>
    </div>
  );
};

export default RootLayout;
