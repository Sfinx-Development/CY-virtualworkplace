import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import ChatRoom from "./pages/AfterChosenTeam/ChatRoomPage";
import CreateMeeting from "./pages/AfterChosenTeam/CreateMeetingPage";
import InviteToMeeting from "./pages/AfterChosenTeam/InviteToMeetingPage";
import MeetingRoom from "./pages/AfterChosenTeam/MeetingRoomPage";
import Menu from "./pages/AfterChosenTeam/MenuPage";
import Office from "./pages/AfterChosenTeam/OfficePage";
import CreateAccount from "./pages/NotSignedIn/CreateAccountPage";
import IndexPage from "./pages/NotSignedIn/IndexPage";
import SignIn from "./pages/NotSignedIn/SignInPage";
import RootLayout from "./pages/RootLayout";
import ChooseTeam from "./pages/StartSignedIn/ChooseTeamPage";
import CreateTeam from "./pages/StartSignedIn/CreateTeamPage";
import EnterHouse from "./pages/StartSignedIn/EnterHousePage";
import JoinTeam from "./pages/StartSignedIn/JoinTeamPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route index element={<IndexPage />}></Route>
      {/* <Route path="product/:id" element={<ProductPage />}></Route> */}
      {/* dessa ska man bara kunna nå om man inte är inloggad : */}
      <Route path="signin" element={<SignIn />}></Route>
      <Route path="createaccount" element={<CreateAccount />}></Route>
      {/* dessa kommer man till när man har loggat in: */}
      <Route path="chooseteam" element={<ChooseTeam />}></Route>
      <Route path="createteam" element={<CreateTeam />}></Route>
      <Route path="jointeam" element={<JoinTeam />}></Route>
      <Route path="enterhouse" element={<EnterHouse />}></Route>
      {/* dessa kommer man till när man valt ett team: */}
      <Route path="menu" element={<Menu />}></Route>
      <Route path="meetingroom" element={<MeetingRoom />}></Route>
      <Route path="office" element={<Office />}></Route>
      <Route path="chatroom" element={<ChatRoom />}></Route>
      <Route path="createmeeting" element={<CreateMeeting />}></Route>
      <Route path="invitetomeeting" element={<InviteToMeeting />}></Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
