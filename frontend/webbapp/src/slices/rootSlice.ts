import { AnyAction, Reducer, combineReducers } from "@reduxjs/toolkit";
import { AuthState, authReducer } from "./authSlice";
import { MeetingState, meetingReducer } from "./meetingSlice";
import { MessageState, messageReducer } from "./messageSlice";
import { ProfileState, profileReducer } from "./profileSlice";
import { ProjectState, projectReducer } from "./projectSlice";
import { SurveyState, surveyReducer } from "./survey";
import { TeamState, teamReducer } from "./teamSlice";
import { TodoState, todoReducer } from "./todoSlice";
import { UserState, userReducer } from "./userSlice";

export interface RootState {
  profileSlice: ProfileState;
  userSlice: UserState;
  authSlice: AuthState;
  teamSlice: TeamState;
  meetingSlice: MeetingState;
  messageSlice: MessageState;
  surveySlice: SurveyState;
  projectSlice: ProjectState;
  todoSlice: TodoState;
}

const appReducer = combineReducers({
  profileSlice: profileReducer,
  userSlice: userReducer,
  authSlice: authReducer,
  teamSlice: teamReducer,
  meetingSlice: meetingReducer,
  messageSlice: messageReducer,
  surveySlice: surveyReducer,
  projectSlice: projectReducer,
  todoSlice: todoReducer,
});

const rootReducer: Reducer<RootState, AnyAction> = (state, action) => {
  if (action.type === "user/logout") {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
