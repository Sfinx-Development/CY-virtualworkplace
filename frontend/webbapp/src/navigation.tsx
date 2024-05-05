// Navigation.tsx

import AgoraRTC, { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import CreateComment from "./pages/AfterChosenTeam/CreateComment";
import CreateHealthCheck from "./pages/AfterChosenTeam/CreateHealthCheck";
import CreateUpdate from "./pages/AfterChosenTeam/CreateUpdate";
import EnterHouse from "./pages/AfterChosenTeam/EnterHousePage";
import InviteToMeeting from "./pages/AfterChosenTeam/InviteToMeetingPage";
import { LiveVideo } from "./pages/AfterChosenTeam/LiveForm";
import TestWave from "./pages/AfterChosenTeam/TestWave";
import UpdateComments from "./pages/AfterChosenTeam/UpdateComments";
import CreateMeeting from "./pages/MeetingRoom/CreateMeetingPage";
import CreateProject from "./pages/MeetingRoom/CreateProject";
import HealthCheckHub from "./pages/MeetingRoom/HealthCheckPage";
import MeetingInTeamsPage from "./pages/MeetingRoom/MeetingInTeam";
import { MeetingRoom } from "./pages/MeetingRoom/MeetingRoomPage";
import Projects from "./pages/MeetingRoom/Projects";
import SettingsPage from "./pages/MeetingRoom/SettingsPage";
import CalendarPage from "./pages/Menu/CalendarPage";
import ChatRoom from "./pages/Menu/ChatRoomPage";
import Menu from "./pages/Menu/MenuPage";
import Notifications from "./pages/Menu/Office/Notifications";
import Office from "./pages/Menu/Office/OfficePage";
import ProfileInformation from "./pages/Menu/Office/ProfileInformation";
import CreateAccount from "./pages/NotSignedIn/CreateAccountPage";
import ForgotPassword from "./pages/NotSignedIn/ForgotPasswordPage";
import IndexPage from "./pages/NotSignedIn/IndexPage";
import SignIn from "./pages/NotSignedIn/SignInPage";
import RootLayout from "./pages/RootLayout";
import ChooseTeam from "./pages/StartSignedIn/ChooseTeamPage";
import CreateTeam from "./pages/StartSignedIn/CreateTeamPage";
import JoinTeam from "./pages/StartSignedIn/JoinTeamPage";
import UserSettings from "./pages/StartSignedIn/UserSettings";
import { resetActiveProile } from "./slices/profileSlice";
import { useAppDispatch, useAppSelector } from "./slices/store";
import { resetActiveTeam } from "./slices/teamSlice";
import { getUserAsync } from "./slices/userSlice";

const Navigation = () => {
  const [userLoaded, setUserLoaded] = useState(false);
  const user = useAppSelector((state) => state.userSlice.user);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUserAsync()).then(() => {
      setUserLoaded(true);
    });
  }, []);

  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname === "/chooseteam" ||
      location.pathname === "/signin"
    ) {
      console.log("choose team");
      dispatch(resetActiveProile());
      dispatch(resetActiveTeam());
    }
  }, [dispatch, location]);
  const navigate = useNavigate();

  useEffect(() => {
    if (userLoaded && !user) {
      navigate("/signin", { replace: true });
    }
  }, [userLoaded, user]);

  const agoraClient = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  ); // Initialize Agora Client

  const handleConnect = () => {
    navigate(`livemeeting`); // on form submit, navigate to new route
  };

  return (
    <Routes>
      {user ? (
        <Route element={<RootLayout />}>
          <Route path="chooseteam" element={<ChooseTeam />} />
          <Route path="createteam" element={<CreateTeam />} />
          <Route path="jointeam" element={<JoinTeam />} />
          <Route path="usersettings" element={<UserSettings />} />
          {/* //DENNA EJ SOM EN VANLIG NAVIGATION - BARA KÖRAS? GÅR DET */}
          <Route path="enterhouse" element={<EnterHouse />} />
          <Route path="menu" element={<Menu />} />
          <Route
            path="meetingroom"
            element={<MeetingRoom connectToVideo={handleConnect} />}
          >
            <Route index element={<Projects />} />
            <Route path="healthcheck" element={<HealthCheckHub />} />
            <Route path="createmeeting" element={<CreateMeeting />} />
            <Route path="createproject" element={<CreateProject />} />
            <Route path="meetinginteam" element={<MeetingInTeamsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="office" element={<Office />}>
            <Route path="" element={<Notifications />} />
            <Route path="information" element={<ProfileInformation />} />
          </Route>
          <Route path="createhealthcheck" element={<CreateHealthCheck />} />
          <Route path="chatroom" element={<ChatRoom />} />
          <Route path="invitetomeeting" element={<InviteToMeeting />} />
          <Route path="/" element={<IndexPage />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="createaccount" element={<CreateAccount />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="createupdate" element={<CreateUpdate />} />
          <Route path="updateevents" element={<UpdateComments />} />
          <Route path="createcomment" element={<CreateComment />} />
          <Route path="test" element={<TestWave />} />
          <Route
            path="/livemeeting"
            element={
              <AgoraRTCProvider client={agoraClient}>
                <LiveVideo />
              </AgoraRTCProvider>
            }
          />
        </Route>
      ) : (
        <Route element={<RootLayout />}>
          <Route path="/" element={<IndexPage />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="createaccount" element={<CreateAccount />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
        </Route>
      )}
    </Routes>
  );
};

export default Navigation;
