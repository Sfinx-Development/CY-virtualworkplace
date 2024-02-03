// Navigation.tsx

import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import ChatRoom from "./pages/AfterChosenTeam/ChatRoomPage";
import CreateMeeting from "./pages/AfterChosenTeam/CreateMeetingPage";
import InviteToMeeting from "./pages/AfterChosenTeam/InviteToMeetingPage";
import MeetingRoom from "./pages/AfterChosenTeam/MeetingRoomPage";
import Menu from "./pages/AfterChosenTeam/MenuPage";
import Office from "./pages/AfterChosenTeam/OfficePage";
import CreateAccount from "./pages/NotSignedIn/CreateAccountPage";
import ForgotPassword from "./pages/NotSignedIn/ForgotPasswordPage";
import IndexPage from "./pages/NotSignedIn/IndexPage";
import SignIn from "./pages/NotSignedIn/SignInPage";
import RootLayout from "./pages/RootLayout";
import ChooseTeam from "./pages/StartSignedIn/ChooseTeamPage";
import CreateTeam from "./pages/StartSignedIn/CreateTeamPage";
import EnterHouse from "./pages/StartSignedIn/EnterHousePage";
import JoinTeam from "./pages/StartSignedIn/JoinTeamPage";
import { useAppDispatch, useAppSelector } from "./slices/store";
import { getUserAsync } from "./slices/userSlice";

const Navigation = () => {
  const user = useAppSelector((state) => state.userSlice.user);
  console.log("User:", user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUserAsync());
  }, []);

  return (
    <Routes>
      {user ? (
        <Route element={<RootLayout />}>
          <Route path="chooseteam" element={<ChooseTeam />} />
          <Route path="createteam" element={<CreateTeam />} />
          <Route path="jointeam" element={<JoinTeam />} />
          <Route path="enterhouse" element={<EnterHouse />} />
          <Route path="menu/:id" element={<Menu />} />
          <Route path="meetingroom" element={<MeetingRoom />} />
          <Route path="office" element={<Office />} />
          <Route path="chatroom" element={<ChatRoom />} />
          <Route path="createmeeting" element={<CreateMeeting />} />
          <Route path="invitetomeeting" element={<InviteToMeeting />} />
          <Route path="/" element={<IndexPage />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="createaccount" element={<CreateAccount />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
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
