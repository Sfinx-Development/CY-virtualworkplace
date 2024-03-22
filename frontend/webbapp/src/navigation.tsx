// Navigation.tsx

import AgoraRTC, { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import ChatRoom from "./pages/AfterChosenTeam/ChatRoomPage";
import CreateMeeting from "./pages/AfterChosenTeam/CreateMeetingPage";
import EnterHouse from "./pages/AfterChosenTeam/EnterHousePage";
import HealthCheckHub from "./pages/AfterChosenTeam/HealthCheckHub";
import InviteToMeeting from "./pages/AfterChosenTeam/InviteToMeetingPage";
import { LiveVideo } from "./pages/AfterChosenTeam/LiveForm";
import MeetingInTeamsPage from "./pages/AfterChosenTeam/MeetingInTeam";
import { MeetingRoom } from "./pages/AfterChosenTeam/MeetingRoomPage";
import Menu from "./pages/AfterChosenTeam/MenuPage";
import Office from "./pages/AfterChosenTeam/OfficePage";
import OngoingMeeting from "./pages/AfterChosenTeam/OngoingMeeting";
import CreateAccount from "./pages/NotSignedIn/CreateAccountPage";
import ForgotPassword from "./pages/NotSignedIn/ForgotPasswordPage";
import IndexPage from "./pages/NotSignedIn/IndexPage";
import SignIn from "./pages/NotSignedIn/SignInPage";
import RootLayout from "./pages/RootLayout";
import ChooseTeam from "./pages/StartSignedIn/ChooseTeamPage";
import CreateTeam from "./pages/StartSignedIn/CreateTeamPage";
import JoinTeam from "./pages/StartSignedIn/JoinTeamPage";
import { useAppDispatch, useAppSelector } from "./slices/store";
import { getUserAsync } from "./slices/userSlice";
import CreateHealthCheck from "./pages/AfterChosenTeam/CreateHealthCheck";

const Navigation = () => {
  const [userLoaded, setUserLoaded] = useState(false);
  const user = useAppSelector((state) => state.userSlice.user);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUserAsync()).then(() => {
      setUserLoaded(true);
    });
  }, []);

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
      {/* <Route
        path="*"
        element={user ? null : <Navigate to="/signin" replace />}
      /> */}
      {user ? (
        <Route element={<RootLayout />}>
          <Route path="chooseteam" element={<ChooseTeam />} />
          <Route path="createteam" element={<CreateTeam />} />
          <Route path="jointeam" element={<JoinTeam />} />
          <Route path="enterhouse" element={<EnterHouse />} />
          <Route path="menu" element={<Menu />} />
          <Route
            path="meetingroom"
            element={<MeetingRoom connectToVideo={handleConnect} />}
          />
          <Route path="office" element={<Office />} />
          <Route path="healthcheck" element={<HealthCheckHub />} />
          <Route path="createhealthcheck" element={<CreateHealthCheck />} />
          <Route path="chatroom" element={<ChatRoom />} />
          <Route path="createmeeting" element={<CreateMeeting />} />
          <Route path="invitetomeeting" element={<InviteToMeeting />} />
          <Route path="/" element={<IndexPage />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="createaccount" element={<CreateAccount />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
          <Route path="meetinginteam" element={<MeetingInTeamsPage />} />
          <Route path="joinmeeting" element={<OngoingMeeting />} />
          {/* <Route
            path="connect"
            element={<ConnectForm connectToVideo={handleConnect} />}
          /> */}
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
