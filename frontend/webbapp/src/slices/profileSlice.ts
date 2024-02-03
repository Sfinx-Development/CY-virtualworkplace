import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Profile } from "../../types";
import { FetchGetTeamProfiles } from "../api/profile";

interface ProfileState {
  profiles: Profile[] | undefined;
  error: string | null;
}

const saveProfilesToLocalStorage = (profiles: Profile[]) => {
  localStorage.setItem("profiles", JSON.stringify(profiles));
};
const loadProfilesFromLocalStorage = (): Profile[] | undefined => {
  const storedProfiles = localStorage.getItem("profiles");
  return storedProfiles ? JSON.parse(storedProfiles) : undefined;
};

export const initialState: ProfileState = {
  profiles: loadProfilesFromLocalStorage(),
  error: null,
};

export const GetTeamProfiles = createAsyncThunk<
  Profile[],
  string,
  { rejectValue: string }
>("profile/getTeamProfiles", async (teamId, thunkAPI) => {
  try {
    const teamProfiles = await FetchGetTeamProfiles(teamId);
    if (teamProfiles) {
      console.log("profiler hämtade:", teamProfiles);
      saveProfilesToLocalStorage(teamProfiles);
      return teamProfiles;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid hämtning av profiler."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid hämtning av profiler."
    );
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetTeamProfiles.fulfilled, (state, action) => {
        console.log("Fulfilled action payload:", action.payload);
        if (action.payload) {
          state.profiles = action.payload;
          state.error = null;
        }
      })
      .addCase(GetTeamProfiles.rejected, (state) => {
        state.profiles = undefined;
        state.error = "Något gick fel med hämtandet av profiler.";
      });
  },
});

export const profileReducer = profileSlice.reducer;
