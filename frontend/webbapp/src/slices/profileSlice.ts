import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Profile } from "../../types";
import { FetchGetTeamProfiles, FetchMyProfile } from "../api/profile";

interface ProfileState {
  profiles: Profile[] | undefined;
  activeProfile: Profile | undefined;
  error: string | null;
}

const saveProfilesToLocalStorage = (profiles: Profile[]) => {
  localStorage.setItem("profiles", JSON.stringify(profiles));
};
const loadProfilesFromLocalStorage = (): Profile[] | undefined => {
  const storedProfiles = localStorage.getItem("profiles");
  return storedProfiles ? JSON.parse(storedProfiles) : undefined;
};
const saveActiveProfileToLocalStorage = (profile: Profile) => {
  localStorage.setItem("activeProfile", JSON.stringify(profile));
};
const loadActiveProfileFromLocalStorage = (): Profile | undefined => {
  const storedActiveProfile = localStorage.getItem("activeProfile");
  return storedActiveProfile ? JSON.parse(storedActiveProfile) : undefined;
};

export const initialState: ProfileState = {
  profiles: loadProfilesFromLocalStorage(),
  activeProfile: loadActiveProfileFromLocalStorage(),
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

export const GetMyProfileAsync = createAsyncThunk<
  Profile,
  string,
  { rejectValue: string }
>("profile/getMyProfile", async (teamId, thunkAPI) => {
  try {
    const myProfile = await FetchMyProfile(teamId);
    if (myProfile) {
      console.log("profil hämtade:", myProfile);
      saveActiveProfileToLocalStorage(myProfile);
      return myProfile;
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
  reducers: {
    // setActiveProfile: (state, action) => {
    //   const profileId = action.payload;
    //   const activeProfile = state.profiles?.find(
    //     (profile: Profile) => profile.id === profileId
    //   );
    //   if (activeProfile) {
    //     state.activeProfile = activeProfile;
    //     saveActiveProfileToLocalStorage(activeProfile);
    //   }
    // },
    getActiveProfile: (state) => {
      const activeProfile = loadActiveProfileFromLocalStorage();
      if (activeProfile) {
        state.activeProfile = activeProfile;
      }
    },
  },
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
      })
      .addCase(GetMyProfileAsync.fulfilled, (state, action) => {
        console.log("Fulfilled action payload:", action.payload);
        if (action.payload) {
          state.activeProfile = action.payload;
          state.error = null;
        }
      })
      .addCase(GetMyProfileAsync.rejected, (state) => {
        state.activeProfile = undefined;
        state.error = "Något gick fel med hämtandet av aktiv profil.";
      });
  },
});

export const { getActiveProfile } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
