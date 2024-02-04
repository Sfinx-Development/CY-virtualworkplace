import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authReducer } from "./authSlice";


import { meetingReducer } from "./meetingSlice";

import { profileReducer } from "./profileSlice";
import { teamReducer } from "./teamSlice";
import { userReducer } from "./userSlice";


const store = configureStore({
  reducer: {
    userSlice: userReducer,
    authSlice: authReducer,
    teamSlice: teamReducer,

    meetingSlice: meetingReducer

    profileSlice: profileReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
