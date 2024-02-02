import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { userReducer } from "./userSlice";
import { authReducer } from "./authSlice";
import { teamReducer } from "./themeSlice";

const store = configureStore({
  reducer: {
    userSlice: userReducer,
    authSlice: authReducer,
    teamSlice: teamReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
