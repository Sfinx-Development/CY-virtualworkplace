import { AnyAction, Reducer, combineReducers } from "@reduxjs/toolkit";
import { AuthState, authReducer } from "./authSlice";
import { ConversationState, conversationReducer } from "./conversationSlice";
import { HealthCheckState, healthcheckReducer } from "./healthcheck";
import { MeetingState, meetingReducer } from "./meetingSlice";
import { MessageState, messageReducer } from "./messageSlice";
import { ProfileState, profileReducer } from "./profileSlice";
import { TeamState, teamReducer } from "./teamSlice";
import { UserState, userReducer } from "./userSlice";

export interface RootState {
  profileSlice: ProfileState;
  userSlice: UserState;
  authSlice: AuthState;
  teamSlice: TeamState;
  meetingSlice: MeetingState;
  conversationSlice: ConversationState;
  messageSlice: MessageState;
  healthcheckSlice: HealthCheckState;
}

const appReducer = combineReducers({
  profileSlice: profileReducer,
  userSlice: userReducer,
  authSlice: authReducer,
  teamSlice: teamReducer,
  meetingSlice: meetingReducer,
  conversationSlice: conversationReducer,
  messageSlice: messageReducer,
  healthcheckSlice: healthcheckReducer
});

const rootReducer: Reducer<RootState, AnyAction> = (state, action) => {
  if (action.type === "user/logout") {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
